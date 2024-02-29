import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: "import.meta.env.CLOUDINARY_CLOUD_NAM",
  },
  url: {
    secure: true,
  },
});

type getImageUrl = {
  url: string;
  width: number;
};
export const getCloudinaryImageUrl = ({ url, width }: getImageUrl) => {
  const imageUrl = cloudinary
    .image(url)
    .resize(fill(width, width).gravity("auto"))
    .setDeliveryType("fetch")
    .toURL();
  console.log("Cloudinary", imageUrl);
  return imageUrl;
};
