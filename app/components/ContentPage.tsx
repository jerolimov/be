import { Content } from "~/types/content";

export default function ContentPage({ content }: { content: Content }) {
  return (
    <div>
      <h1>{content.title}</h1>
      {content.content ? <div dangerouslySetInnerHTML={{ __html: content.content }} /> : null}
    </div>
  );
}
