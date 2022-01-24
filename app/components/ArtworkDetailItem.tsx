import { Artwork } from "~/types/artworks";

export default function ArtworkDetailItem({ artwork }: { artwork: Artwork }) {
  return (
    <div>
      <h1>{artwork.title}</h1>
      {artwork.images?.map((image) => {
        const width = image.width && image.height ? image.width : undefined;
        const height = image.width && image.height ? image.height : undefined;
        return (
          <div key={image.id} className="bg-gray-100 rounded-xl">
            <img
              width={width}
              height={height}
              src={image.url}
              alt=""
            />
          </div>
        );
      })}
      {artwork.technique ? <div>{artwork.technique}</div> : null}
      {artwork.material ? <div>{artwork.material}</div> : null}
      {artwork.size ? <div>{artwork.size}</div> : null}
    </div>
  );
}
