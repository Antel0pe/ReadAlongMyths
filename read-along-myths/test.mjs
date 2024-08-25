import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

const completion = await openai.images.generate({
    // model: "dall-e-3",
    prompt: "You are generating images to accompany a historical exploration of the US during 1609. Generate an image to accompany the text: In 1609, Henry Hudson, an English explorer sailing for the Dutch East India Company, navigated up the river that would later bear his name, the Hudson River. This expedition marked the beginning of European exploration in the region and ultimately led to the establishment of Dutch claims to the area, contributing to the development of New Amsterdam, which would later become New York City.",
    n: 1,
    size: "1024x1024",
  });

console.log(completion.data[0].url);



// const response = await openai.images.generate({
//     model: "dall-e-3",
//     prompt: "a white siamese cat",
//     n: 1,
//     size: "1024x1024",
//   });
// image_url = response.data[0].url;