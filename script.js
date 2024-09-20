document.addEventListener("DOMContentLoaded",() =>{
const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "sk-vBahl4VwD_Cx1KAPfxHZK5jY4QLbUyGTFkPp1JSL7nT3BlbkFJtFAW0FgxO-A6fwpPyHg-ZOHO3Q4M-7NL80etB04i8A";
let isImageGenerating =false;

const updateImageCard = (imgDataArray) => {

   imgDataArray.forEach((imgObject, index) =>  {

      const imgCard = imageGallery.querySelectorAll(".img-card") [index];
      const imgElement = imgCard.querySelector("img");
      const downloadBtn = imgCard.querySelector(".download-btn");

      const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImg;
    imgElement.onload = () => { 
        imgCard.classList.remove("loading");
        downloadBtn.setAttribute("href", aiGeneratedImg);
        downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
   }
});
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: Math.min(parseInt(userImgQuantity), 4), // Ensure no more than 4 images
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("Error:", response.status, response.statusText, errorResponse);
            alert(`Failed to generate images: ${errorResponse.error.message}`);
            throw new Error("Failed to generate images! Please try again.");
        }

        const { data } = await response.json(); // Get data from the response
        updateImageCard([...data]);

    } catch (error) {
        console.error("Error:", error);  // Log full error to see details
        alert(error.message);
    } finally {
        isImageGenerating = false;
    }
};



const handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating =true;
    const userPrompt = e.target[0].value;
    const userImgQuantity = e.target[1].value;
  
    const imgCardMarkup = Array.from({length: userImgQuantity}, () =>
        `<div class="img-card loading">
        <img src="images/loader.svg" alt="image">
        <a href="#" class="download-btn">
        <img src="images/download.svg" alt="download icon">
        </a>
        </div>`
  
    ).join("");
 
    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages (userPrompt, userImgQuantity);
};
        
generateForm.addEventListener("submit", handleFormSubmission);
});