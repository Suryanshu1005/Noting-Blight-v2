import React, { useState } from "react";
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setPrediction(data);
    } else {
      console.log("Server returned error status code:", response.status);
    }
    console.log(response)
  };

  return (
    <>
      <img src="https://images.unsplash.com/photo-1534030665069-90e016e995e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
        className="absolute h-screen w-full" style={{ filter: "blur(5px) brightness(50%)" }} />
      <div className="relative text-center">
        <h1 className="text-black text-[30px] p-16 font-serif font-bold">Potato Disease Detection By Noting Blight Team</h1>

        <div className="backdrop-blur-sm bg-white/20 rounded-lg flex justify-center items-center h-80 w-96 mx-auto">
          <form className="text-black text-[20px] flex flex-col" onSubmit={handleSubmit}>
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-lg p-3 text-center">
              <span className="text-base font-bold text-gray-900">Choose a file</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileSelect} />
            </label>
            {previewImage && (
              <div className="relative">
                <img src={previewImage} alt="Preview" className="mx-auto max-w-full mt-5 flex flex-col rounded-3xl" onLoad={(e) => {
                  const imgHeight = e.target.height;
                  const imgWidth = e.target.width;
                  const aspectRatio = imgWidth / imgHeight;
                  const containerWidth = document.getElementById("image-container").clientWidth;
                  const containerHeight = containerWidth / aspectRatio;
                  document.getElementById("image-container").style.height = `${containerHeight}px`;
                }} />
                {/* <div className="absolute inset-0 bg-black opacity-40"></div> */}
                <div id="image-container" className="absolute inset-0 flex items-center justify-center"></div>
              </div>
            )}
            <div className="text-center mt-12">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
              Predict
            </button>
          </div>
          </form>
        </div>
        {prediction && (
          <div className="flex justify-center items-center mt-16">
          <div className="z-50">
            <div className="backdrop-blur-sm bg-white/20 rounded-3xl text-center w-72 h-44">
              <h2 className="p-3 text-[20px]">Results:</h2>
              <p className="p-3 text-[20px]">Disease : {prediction.class}</p>
              <p className="p-3 text-[20px]">Accuracy : {(prediction.confidence * 100).toFixed(2)}%</p>
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
}

export default App;
