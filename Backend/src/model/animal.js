import { prisma } from "../../prisma.config.js";


export const updateAnimalThreatLevel = async (animalId, newThreatLevel) => {
  const updatedAnimal = await prisma.animal.update({
    where: { id: animalId },
    data: { threatLevel: newThreatLevel },
  });
  return updatedAnimal;
};

export const getAnimalId = async (userId, animalName) => {
  const animal = await prisma.animal.findMany({
    where: {
      name: animalName,
      userId: userId
    }
  });

  return animal[0]?.id;
};


export const getThreatLevel = async (animalId)=>{
  const animal = await prisma.animal.findUnique ({
    where:{
      id:animalId,
    }
  });
  let threatLevel= animal.threatLevel;
  return threatLevel;
}