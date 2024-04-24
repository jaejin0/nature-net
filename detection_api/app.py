from flask import Flask, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename
import os
import torch
from ultralytics import YOLO
import shutil
import numpy as np
import requests
import json
import smtplib
from email.message import EmailMessage

app = Flask(__name__)

# Set the upload folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# list of carriers for sms feature
CARRIERS = {
    "att": "@txt.att.net",
    "tmobile": "@tmomail.net",
    "verizon": "@vtext.com",
    "sprint": "@messaging.sprintpcs.com"
}

def process_response(response_text, coordinates, image_size, animal_name):
    user_status_response = requests.get('http://localhost:3000/user/status')
    user_status_data = user_status_response.json()
    userId = user_status_data['id']

    log_data = {
        "userId": userId,
        "animalName": animal_name
    }

    animal_user_id = requests.post('http://localhost:3000/animal/animalId', json=log_data)

    animal_id = animal_user_id.text.split(":")[-1].strip()

    # Parse JSON response
    response_data = json.loads(response_text)
    
    # Extract necessary data
    image_url = response_data['url']
    image_size_str = f"[{image_size[0]}, {image_size[1]}]"
    bounding_box_coordinates_str = json.dumps(coordinates.tolist())

    # Construct log data
    log_data = {
        "image": image_url,
        "imageSize": image_size_str,
        "boundingBoxCoordinates": bounding_box_coordinates_str,
        "userId": userId,  # Replace with actual user ID
        "animalId": int(animal_id),  # Replace with actual animal ID
    }

    # Send POST request to localhost:3000/log
    log_url = 'http://localhost:3000/log'
    response = requests.post(log_url, json=log_data)

    user_data = {
        "userId": userId
    }
    
    # TODO: these needs to be implemented to be based on animal name, threat level, and time
    subject = "NatureNet Alert"
    body = "A " + animal_name + " has been spotted on your camera."
    # TODO: These needs to be implemented to get data from backend
    phone_number = user_status_data['phoneNumber'] # 1231231234 (10 number digits)
    email = user_status_data["email"] # emailaddress@gmail.com

    # message alert
    if phone_number != "":
        for key in CARRIERS:
            carrier = CARRIERS[key]
            send_alert(subject, body, phone_number + carrier)

    # email alert
    send_alert(subject, body, email)
    

def predict_with_yolo(image_path):
    # Load a pre-trained model
    model = YOLO('best.pt')

    # Find GPU
    if torch.backends.mps.is_available():
        device = "mps"
    elif torch.cuda.is_available():
        device = "cuda"
    else:
        device = "cpu"
    print("\ndevice " + device + " is used.")
    model.to(device)

    # Predict with the model
    results = model(image_path, save=True)

    # Get the path of the analyzed image for the first result
    # Eventually, check to see if images have bounding boxes, and if they do, insert
    # them into the database along with the coordinates of the bounding box.
    # Eventually set save=False in the modeling process. Images will only be sent
    # to the uploads folder. Somehow delete/ dont save images w/o bounding box

    result = results[0]
    coordinates = result.boxes.xyxy.numpy()
    animal = ""
    for r in results:
        for box in r.boxes:
            class_id = int(box.data[0][-1])
            animal = model.names[class_id]

    if(len(result.boxes.conf) != 0 and int(result.boxes.conf[0] > 0.5)):
        save_dir = result.save_dir
        image_name = os.path.basename(image_path)  # Get the base name of the original image
        analyzed_image_path = os.path.join(save_dir, image_name)  # Combine save_dir and image_name
        #print("\n" + analyzed_image_path + "\n")

        # Prepare data for upload
        files = {'image': open(analyzed_image_path, 'rb')}

        # Send POST request to localhost:3000/upload
        upload_url = 'http://localhost:3000/upload'
        response = requests.post(upload_url, files=files)

        # Print response
        # print('Response:', response.text)

        process_response(response.text, coordinates, [640, 480], animal)

        return(analyzed_image_path)
    else: return None

def send_alert(subject, body, to):
    user = "naturenet.alert@gmail.com"
    password = "yqic pftp vhsk iylx"
    
    msg = EmailMessage()
    msg.set_content(body)
    msg['subject'] = subject
    msg['to'] = to
    msg['from'] = user
    
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(user, password)
    server.send_message(msg)

    server.quit()

@app.route('/')
def welcome():
    return 'NatureNet'

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # Check if the post request has the file part
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an empty file without a filename
        if file.filename == '':
            return redirect(request.url)
        if file:
            # Save the uploaded file to the specified upload folder
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            # Perform prediction
            prediction_path = predict_with_yolo(file_path)
            if prediction_path is not None:
                analyzed_image_path = str(prediction_path).replace('\\', '/')
                analyzed_filename = secure_filename(file.filename)
                analyzed_static_path = os.path.join('static', analyzed_filename)
                #shutil.copy(analyzed_image_path, analyzed_static_path)

                # Display the analyzed image on the results page
                return render_template('result.html', image_path=analyzed_filename)
            else:
                return render_template('upload.html')

    return render_template('upload.html')

@app.route('/images')
def image_gallery():
    static_folder = os.path.join(os.getcwd(), 'static')
    image_list = [filename for filename in os.listdir(static_folder) if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]
    return render_template('images.html', image_list=image_list)

if __name__ == '__main__':
    app.run(debug=True)
