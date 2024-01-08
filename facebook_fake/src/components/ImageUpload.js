import React, { useState } from "react";
import "./ImageUpload.css";
import { storage } from "../firebase";
import axios from "../axios";

const ImageUpload = ({ username }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const [url, setUrl] = useState("");

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!image) {
      console.error("No image selected!");
      return;
    }

    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((downloadUrl) => {
            setUrl(downloadUrl);
            axios.post("/upload", {
              caption: caption,
              user: username,
              image: downloadUrl,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <progress className="imageUpload__progress" value={progress} max="100" />
      <input
        type="text"
        placeholder="Enter a caption..."
        className="imageUpload__input"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input
        className="imageUpload__file"
        type="file"
        onChange={(e) => handleChange(e)}
      />
      <button className="imageUpload__button" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};

export default ImageUpload;
