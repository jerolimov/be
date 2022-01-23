import { Page } from "~/types/pages";

export default function ContentPage({ page }: { page: Page }) {
  return (
    <div>
      <h1>{page.title}</h1>
      {page.content ? <div dangerouslySetInnerHTML={{ __html: page.content }} /> : null}
    </div>
  );
}
