import { CreateScoreboardRequest } from "@/app/interfaces/CreateScoreboardRequest";
import Jimp from 'jimp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import request from 'request'; // Consider using modern alternatives like 'axios' or 'node-fetch'

export default async function handler(req: any, res: any) {
    try {
        const r: CreateScoreboardRequest = req.body;
        const imagePath = path.resolve('./public/images/sample.jpg'); // Path to your image
        const guid = uuidv4();


        const plugin = require.resolve('@jimp/plugin-print');
        const jimpFont = path.resolve(plugin, '../../fonts/open-sans/open-sans-32-black/open-sans-32-black.fnt');

        console.log("Font path:", jimpFont);
        console.log("Image path:", imagePath);


        // Load the image using Jimp
        const image = await Jimp.read(imagePath);


        const font = await Jimp.loadFont(jimpFont);


        image.print(font, 250, 30, "Players", 500); // Ensure your text fits within the image width
        image.print(font, 250, 70, "# of beers", 500);
        image.print(font, 250, 120, r.ScoreRows[0].Name, 500);

        // Get image buffer
        const imageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

        // Set up options for the upload
        const options = {
            method: 'POST',
            url: 'https://api.app.pixelgreet.com/Image/UploadImage2',
            headers: {},
            formData: {
                'Image': {
                    'value': imageBuffer,
                    'options': {
                        'filename': `${guid}.jpg`,
                        'contentType': 'image/jpeg'
                    }
                },
                'FileName': guid
            }
        };

        // Upload the image
        request(options, function (error: any, response: any) {
            if (error) throw new Error(error);
            console.log("Image uploaded:", response.body);
            return res.status(200).json({ url: response.body, errorMessage: "", success: true });
        });

    } catch (error: any) {
        console.error("Handler error:", error);
        return res.status(200).json({ url: "", errorMessage: error, success: false });
    }
}