from flask import Flask, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename
import os
import torch
from ultralytics import YOLO
import shutil

app = Flask(__name__)

# Set the path to the YOLO model
model_path = '/nature-net/best.pt'

# Set the upload folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
    result = results[0]
    if(len(result.boxes.conf) != 0):
        print('confidence', int(result.boxes.conf[0]))
    if(len(result.boxes.conf) != 0 and int(result.boxes.conf[0] > 0.5)):
        save_dir = result.save_dir
        image_name = os.path.basename(image_path)  # Get the base name of the original image
        analyzed_image_path = os.path.join(save_dir, image_name)  # Combine save_dir and image_name

        return(analyzed_image_path)
    else: return None

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
                shutil.copy(analyzed_image_path, analyzed_static_path)

                # Display the analyzed image on the results page
                return render_template('result.html', image_path=analyzed_filename)
            else:
                return render_template('upload.html')

    return render_template('upload.html')

if __name__ == '__main__':
    app.run(debug=True)
