import { prisma } from "../../prisma.config.js";

export const createLog = async (data) => {
  let { image, imageSize, boundingBoxCoordinates, userId, animalId, animalName } = data;

  imageSize = JSON.stringify(imageSize);
  boundingBoxCoordinates = JSON.stringify(boundingBoxCoordinates);

  const log = await prisma.log.create({
    data: {
      boundingBoxCoordinates,
      image,
      imageSize,
      animalId,
      userId,
      animalName,
    },
  });

  return log;
};

export const getLogs = async (userId) => {
  const logs = await prisma.log.findMany({
    where: {
      userId,
    },
    orderBy: {
      timestamp: 'desc',
    },
  });

  return logs;
};

export const getLog = async (id) => {
  const log = await prisma.log.findUnique({
    where: {
      id,
    },
  });

  return log;
};
