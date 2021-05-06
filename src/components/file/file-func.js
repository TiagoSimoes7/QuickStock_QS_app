import app from "../../base";
const storage = app.storage();

export const getImage = async (nameImage) => {
    const pathReference = storage.ref('product-images/' + nameImage);
    const response = await pathReference.getDownloadURL().then((url) => {
        return url;
      }).catch(function(error) {
        switch (error.code) {
            case 'storage/object-not-found':
                console.log('File doesn\'t exist');
                break;
            case 'storage/unauthorized':
                console.log('User doesn\'t have permission to access the object');
                break;

            case 'storage/canceled':
                console.log('User canceled the upload');
                break;
            case 'storage/unknown':
                console.log('Unknown error occurred, inspect the server response');
                break;
            default:
                console.log(error)
        }
      });
    return response
}

export const sendImage = async (image, name) => {
    if(image){
        try {
            storage.ref('product-images/' + name).put(image);
            return true;
        }catch (error) {
            console.log(error);
            return false;
        }
        
    }
}