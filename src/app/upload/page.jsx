"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ref, listAll, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../firebaseConfig";
import Link from "next/link";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [outputUrl, setOutputUrl] = useState(null);
  const [clothesImages, setClothesImages] = useState([]);
  const [selectedClothes, setSelectedClothes] = useState(null);
  const [generating, setGenerating] = useState(false);
  const fileInputRef = useRef(null);
  const carouselRef = useRef(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const convertToJpg = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            const jpgFile = new File([blob], "image.jpg", { type: "image/jpeg" });
            resolve(jpgFile);
          }, "image/jpeg");
        };

        img.onerror = (error) => {
          reject(error);
        };
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      let fileToUpload = file;

      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension !== "jpg" && fileExtension !== "jpeg") {
        fileToUpload = await convertToJpg(file);
      }

      const storageRef = ref(storage, 'images/image.jpg');
      await uploadBytes(storageRef, fileToUpload);
      const url = await getDownloadURL(storageRef);
      setUploadedUrl(url);
      console.log("File Uploaded Successfully");

    } catch (error) {
      console.error("Error uploading the file", error);
    } finally {
      setUploading(false);
    }
  };

  const uploadSelectedClothes = async () => {
    if (!selectedClothes) return;

    setUploading(true);

    try {
      const response = await fetch(selectedClothes);
      const blob = await response.blob();

      const storageRef = ref(storage, 'images/clothes.jpg');
      await uploadBytes(storageRef, blob);
      console.log("Clothes Uploaded Successfully");
    } catch (error) {
      console.error("Error uploading the clothes", error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchClothesImages = async () => {
      try {
        const storageRef = ref(storage, 'clothes');
        const listResult = await listAll(storageRef);

        const clothesImageRefs = listResult.items.slice(-10); // Get the latest 10 items
        const urls = await Promise.all(clothesImageRefs.map((itemRef) => getDownloadURL(itemRef)));

        setClothesImages(urls);
      } catch (error) {
        console.error("Error fetching clothes images", error);
      }
    };

    fetchClothesImages();
  }, []);

  const handleSelectClothes = (url) => {
    setSelectedClothes(url);
  };

  const handleGenerate = async () => {
    console.log("Generate button clicked");

    if (!uploadedUrl || !selectedClothes) {
      console.log("Upload URL or selected clothes not set.");
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch("http://localhost:5000/process-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          backgroundName: "image.jpg",
          overlayName: "clothes.jpg",
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        return;
      }

      const result = await response.json();
      console.log("Flask response:", result);

      const outputImagePath = `https://firebasestorage.googleapis.com/v0/b/viton-403b8.appspot.com/o/output%2Foutput.jpg?alt=media`;
      console.log("Output URL:", outputImagePath);
      setOutputUrl(outputImagePath);

    } catch (error) {
      console.error("Error generating output image", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploading(false);
    setUploadedUrl(null);
    setOutputUrl(null);
    setSelectedClothes(null);
    setGenerating(false);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleDragScroll = (e) => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft -= e.movementX; // Moves left or right based on drag
    }
  };
  
  return (
    <div>
      {/* Nav */}
      <nav className="flex items-center justify-between py-10 bg-white px-4 sm:px-6">
        <Link href="/">
          <img src="/baju.svg" alt="Baju Logo" className="h-6 sm:h-8 ml-4 cursor-pointer" />
        </Link>
        <h1 className="text-lg sm:text-2xl font-normal text-gray-900 mx-auto">Virtual Image Try On</h1>
      </nav>
  
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-screen-xl mx-auto mt-10 md:mt-10 sm:mt-4 px-4 sm:px-5">
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-center">
          {/* Image Upload Area */}
          <div
            className="w-full sm:w-80 h-80 bg-gray-700 flex items-center justify-center mb-5 rounded-lg overflow-hidden cursor-pointer"
            onClick={openFileDialog}
          >
            {uploadedUrl ? (
              <Image
                src={uploadedUrl}
                alt="Uploaded"
                width={320}
                height={320}
                layout="responsive"
                className="object-contain"
              />
            ) : (
              <span className="text-white">Upload Image</span>
            )}
          </div>
  
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="bg-white border border-black text-black py-2 px-6 sm:px-6 rounded-lg w-full sm:w-auto transition-colors duration-300 hover:bg-black hover:text-white"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
  
          {/* Clothing Selection with Carousel */}
          <div
            className="mt-8 w-full overflow-hidden"
            ref={carouselRef}
            onMouseDown={(e) => {
              e.preventDefault();
              document.addEventListener('mousemove', handleDragScroll);
              document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', handleDragScroll);
              }, { once: true });
            }}
          >
            <div className="flex flex-row space-x-4 snap-x snap-mandatory" style={{ width: '100%', maxWidth: '400px' }}>
              {clothesImages.map((url, index) => (
                <div
                  key={index}
                  className={`border ${selectedClothes === url ? "border-blue-500" : "border-gray-300"} p-2 rounded-lg cursor-pointer w-1/3 flex justify-center snap-center`}
                  onClick={() => handleSelectClothes(url)}
                  style={{ minWidth: '33.33%' }}
                >
                  <Image
                    src={url}
                    alt={`Clothes ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
  
          {/* Buttons for Uploading Selected Clothes and Generating Output */}
          <div className="mt-4 flex space-x-2">
            <button
              onClick={uploadSelectedClothes}
              disabled={uploading || !selectedClothes}
              className="bg-white border border-black text-black py-2 px-4 sm:px-4 rounded-lg w-full sm:w-auto transition-colors duration-300 hover:bg-black hover:text-white"
            >
              {uploading ? "Uploading Clothes..." : "Upload Selected Cloth"}
            </button>
  
            <button
              onClick={handleGenerate}
              disabled={generating || !uploadedUrl || !selectedClothes}
              className="bg-white border border-black text-black py-2 px-4 sm:px-4 rounded-lg w-full sm:w-auto transition-colors duration-300 hover:bg-black hover:text-white"
            >
              {generating ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
  
  {/* Output Image Area */}
<div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-center">
  <div className="w-full h-80 bg-gray-700 flex items-center justify-center mb-5 rounded-lg overflow-hidden">
    {outputUrl ? (
      <Image
        src={outputUrl}
        alt="Output"
        width={320}
        height={320}
        layout="responsive"
        className="object-contain"
      />
    ) : (
      <span className="text-white">Generated Image</span>
    )}
  </div>
  
  <div className="mt-4 flex space-x-2"> 
    {/* Download Button */}
    <a
      href={outputUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-white border border-black text-black py-2 px-4 sm:px-4 rounded-lg w-full sm:w-auto transition-colors duration-300 hover:bg-black hover:text-white ${!outputUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={(e) => !outputUrl && e.preventDefault()} // Prevent default action if outputUrl is not set
    >
      Download
    </a>
    
    {/* Reset Button */}
    <button
      onClick={handleReset}
      className="bg-white border border-black text-black py-2 px-4 sm:px-4 rounded-lg w-full sm:w-auto transition-colors duration-300 hover:bg-black hover:text-white"
    >
      Reset
    </button>
      </div>
    </div>
    </div>
    </div>
  );
}
