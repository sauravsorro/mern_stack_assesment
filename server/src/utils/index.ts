import mongoose from 'mongoose';

export function idInvalid(id: string) {
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (isValidId) {
    return true;
  } else {
    return false;
  }
}
