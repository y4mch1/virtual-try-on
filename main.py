from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import firebase_admin
from firebase_admin import credentials, storage

app = Flask(__name__)
CORS(app)  

cred = credentials.Certificate("D:/Kuliah/KP/virtual-try-onn/virtual-try-on/viton-403b8-firebase-adminsdk-nq5er-51119882e6.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'viton-403b8.appspot.com'
})

def download_image_from_firebase(image_name):
    bucket = storage.bucket()
    blob = bucket.blob(f'images/{image_name}')
    
    image_data = blob.download_as_bytes()
    image = Image.open(io.BytesIO(image_data))
    
    return image

def upload_to_firebase(image, image_name):
    bucket = storage.bucket()
    blob = bucket.blob(f'output/{image_name}')
    
    img_byte_arr = io.BytesIO()
    
    if image.mode == 'RGBA':
        image = image.convert('RGB')
    
    image.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)

    blob.upload_from_file(img_byte_arr, content_type='image/jpeg')
    
    output_url = blob.public_url
    return output_url

def combine_images(background, overlay):
    bg_width, bg_height = background.size
    overlay_width, overlay_height = overlay.size

    combined_width = bg_width + overlay_width
    combined_height = max(bg_height, overlay_height)

    combined_image = Image.new("RGB", (combined_width, combined_height))

    combined_image.paste(background, (0, 0)) 
    combined_image.paste(overlay, (bg_width, 0))

    return combined_image

@app.route('/process-images', methods=['POST'])
def process_images():
    try:
        data = request.get_json()
        background_name = data.get("backgroundName", "image.jpg")
        overlay_name = data.get("overlayName", "clothes.jpg")
        print(f"Processing images: {background_name} and {overlay_name}")

        background_image = download_image_from_firebase(background_name)
        overlay_image = download_image_from_firebase(overlay_name)
        print("Images downloaded successfully")

        combined_image = combine_images(background_image, overlay_image)
        print("Images combined successfully")
        
        output_url = upload_to_firebase(combined_image, image_name="output.jpg")
        print(f"Image uploaded successfully, output URL: {output_url}")
        
        return jsonify({"outputUrl": output_url}), 200
    
    except Exception as e:
        print(f"Error processing images: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)