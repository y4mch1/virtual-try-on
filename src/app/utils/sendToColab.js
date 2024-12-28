const handleGenerate = async () => {
  if (!uploadedUrl || !selectedClothes) {
    console.log("Upload URL or selected clothes not set.");
    return;
  }

  setGenerating(true);

  try {
    console.log("Fetching output image from Firebase Storage...");
    
    // Fetch output image directly from Firebase Storage
    const outputRef = ref(storage, 'images/output.jpg');
    const url = await getDownloadURL(outputRef);
    
    if (url) {
      setOutputUrl(url);
      console.log("Output URL received:", url); 
    } else {
      console.log("Failed to retrieve output URL.");
    }
  } catch (error) {
    console.error("Error generating output image", error);
  } finally {
    setGenerating(false);
  }
};
