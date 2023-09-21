import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";

export default function useFirebseImage(
  setValue,
  getValues,
  imageName = null,
  callback
) {
  const [image, setImage] = useState("");
  const [progress, setProgess] = useState(0);
  if (!setValue || !getValues) {
    return;
  }
  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setValue("image_name", file.name); //dùng cái setVa trong rhf để lưu thêm cái image khi bấm submit
    handleUploadImage(file);
  };

  const handleDeleteImage = () => {
    const storage = getStorage();
    const imageRef = ref(
      storage,
      "images/" + (imageName || getValues("image_name"))
    );
    deleteObject(imageRef)
      .then(() => {
        console.log("xóa Thành công");
        setImage("");
        setProgess(0);
        callback && callback();
      })
      .catch((error) => {
        console.log("xóa thất bại");
      });
  };

  const handleUploadImage = (file) => {
    const storage = getStorage();
    // copy trên gg
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgess(progressPercent);
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            console.log("Nothing at all");
        }
      },
      (error) => {
        console.log("Error");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImage(downloadURL);
        });
      }
    );
  };

  // copy code trên doc => của fireabse

  return {
    image,
    setImage,
    progress,
    setProgess,
    handleSelectImage,
    handleDeleteImage,
    handleUploadImage,
  };
}
