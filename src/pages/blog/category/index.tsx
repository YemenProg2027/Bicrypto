import Layout from "@/layouts/Default";
import { MashImage } from "@/components/elements/MashImage";
import Link from "next/link";
import Card from "@/components/elements/base/card/Card";
import { PageHeader } from "@/components/elements/base/page-header";
import { useTranslation } from "next-i18next";
import { $serverFetch } from "@/utils/api";
import { ErrorPage } from "@/components/ui/Errors";

interface Props {
  categories: Category[];
  error?: string;
}

const Blog: React.FC<Props> = ({ categories, error }) => {
  const { t } = useTranslation();

  if (error) {
    return (
      <ErrorPage
        title={t("Error")}
        description={t(error)}
        link="/blog"
        linkTitle={t("Back to Blog")}
      />
    );
  }

  return (
    <Layout title={t("Blog")} color="muted">
      <div className="space-y-5 max-w-5xl lg:mx-auto">
        <PageHeader title={t("Blog Categories")} />
        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category, index) => (
            <Link href={`/blog/category/${category.slug}`} passHref key={index}>
              <Card
                shape="curved"
                className="group p-3 transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="relative w-full h-[120px]">
                  <MashImage
                    src={category.image || "/img/placeholder.svg"}
                    alt={category.name}
                    className="rounded-lg object-cover"
                    fill
                  />
                </div>
                <div>
                  <div className="mt-3">
                    <h3 className="line-clamp-2 text-gray-800 dark:text-gray-100">
                      {category.name}
                    </h3>
                    <div>
                      <p className="text-muted-400 font-sans text-xs">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  try {
    const { data, error } = await $serverFetch(context, {
      url: `/api/content/category`,
    });

    if (error || !data) {
      return {
        props: {
          error: error || "Unable to fetch categories.",
        },
      };
    }

    return {
      props: {
        categories: data,
      },
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      props: {
        error: `An unexpected error occurred: ${error.message}`,
      },
    };
  }
}

export default Blog;
