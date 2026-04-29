import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import Section from "@/lib/models/Section";
import Collection from "@/lib/models/Collection";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, ArrowUpDown } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

type SearchParams = {
  page?: string;
  q?: string;
  category?: string;
  section?: string;
  collection?: string;
  sort?: string;
  dir?: string;
};

const PAGE_SIZE = 10;

interface DocRef {
  _id: { toString(): string };
  name: string;
  slug: string;
}

interface AdminProduct {
  id: number;
  name: string;
  brand: string;
  image: string;
  category?: string;
  section?: string;
  collection?: string;
  price?: number;
}

function buildHref(params: SearchParams) {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) qp.set(k, v);
  });
  const q = qp.toString();
  return q ? `/admin/products?${q}` : "/admin/products";
}

async function getData(searchParams: SearchParams) {
  await connectDB();

  const page = Math.max(1, Number(searchParams.page || "1"));
  const query = (searchParams.q || "").trim();
  const category = (searchParams.category || "").trim();
  const section = (searchParams.section || "").trim();
  const collection = (searchParams.collection || "").trim();
  const sort = (searchParams.sort || "id").trim();
  const dir = searchParams.dir === "asc" ? 1 : -1;

  const filter: Record<string, unknown> = {};
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { brand: { $regex: query, $options: "i" } },
    ];
  }
  if (category) filter.category = category;
  if (section) filter.section = section;
  if (collection) filter.collection = collection;

  const sortField = [
    "id",
    "name",
    "price",
    "category",
    "section",
    "collection",
  ].includes(sort)
    ? sort
    : "id";
  const sortObj = { [sortField]: dir, id: -1 } as Record<string, 1 | -1>;

  const [products, total, categories, sections, collections] =
    await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean(),
      Product.countDocuments(filter),
      Category.find().sort({ order: 1, name: 1 }).lean(),
      Section.find().sort({ order: 1, name: 1 }).lean(),
      Collection.find().sort({ order: 1, name: 1 }).lean(),
    ]);

  return {
    products,
    total,
    categories,
    sections,
    collections,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    sort: sortField,
    dir: dir === 1 ? "asc" : "desc",
    query,
    category,
    section,
    collection,
  };
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;
  const {
    products,
    total,
    categories,
    sections,
    collections,
    page,
    totalPages,
    sort,
    dir,
    query,
    category,
    section,
    collection,
  } = await getData(resolved);

  const toggleDir = dir === "asc" ? "desc" : "asc";
  const currentParams: SearchParams = {
    q: query,
    category,
    section,
    collection,
    sort,
    dir,
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-accent-dark">
            Products
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {total} matching products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-accent-gold text-white px-5 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-accent-dark transition-colors w-fit"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <form
        method="GET"
        className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 mb-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search name or brand"
            className="border border-gray-200 px-3 py-2 text-sm rounded-sm md:col-span-2"
          />
          <select
            name="category"
            defaultValue={category}
            className="border border-gray-200 px-3 py-2 text-sm rounded-sm"
          >
            <option value="">All categories</option>
            {categories.map((c: DocRef) => (
              <option key={c._id.toString()} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            name="section"
            defaultValue={section}
            className="border border-gray-200 px-3 py-2 text-sm rounded-sm"
          >
            <option value="">All sections</option>
            {sections.map((s: DocRef) => (
              <option key={s._id.toString()} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            name="collection"
            defaultValue={collection}
            className="border border-gray-200 px-3 py-2 text-sm rounded-sm"
          >
            <option value="">All collections</option>
            {collections.map((c: DocRef) => (
              <option key={c._id.toString()} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            type="submit"
            className="bg-accent-dark text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm"
          >
            Apply Filters
          </button>
          <Link
            href="/admin/products"
            className="border border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm"
          >
            Reset
          </Link>
        </div>
      </form>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead className="border-b border-gray-100">
            <tr className="text-xs uppercase tracking-widest text-gray-400">
              <th className="text-left px-6 py-4">Product</th>
              <th className="text-left px-6 py-4">
                <Link
                  href={buildHref({
                    ...currentParams,
                    sort: "category",
                    dir: toggleDir,
                    page: "1",
                  })}
                  className="inline-flex items-center gap-1"
                >
                  Category <ArrowUpDown size={12} />
                </Link>
              </th>
              <th className="text-left px-6 py-4">
                <Link
                  href={buildHref({
                    ...currentParams,
                    sort: "section",
                    dir: toggleDir,
                    page: "1",
                  })}
                  className="inline-flex items-center gap-1"
                >
                  Section <ArrowUpDown size={12} />
                </Link>
              </th>
              <th className="text-left px-6 py-4">
                <Link
                  href={buildHref({
                    ...currentParams,
                    sort: "collection",
                    dir: toggleDir,
                    page: "1",
                  })}
                  className="inline-flex items-center gap-1"
                >
                  Collection <ArrowUpDown size={12} />
                </Link>
              </th>
              <th className="text-left px-6 py-4">
                <Link
                  href={buildHref({
                    ...currentParams,
                    sort: "price",
                    dir: toggleDir,
                    page: "1",
                  })}
                  className="inline-flex items-center gap-1"
                >
                  Price <ArrowUpDown size={12} />
                </Link>
              </th>
              <th className="text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p: AdminProduct) => (
              <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-accent-dark">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="capitalize text-gray-500">{p.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-500">{p.section || "-"}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-500">{p.collection || "-"}</span>
                </td>
                <td className="px-6 py-4 text-accent-gold font-medium">
                  NGN {Number(p.price || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="p-2 hover:text-accent-gold transition-colors text-gray-400"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteProductButton productId={p.id} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  className="px-6 py-10 text-center text-gray-400"
                  colSpan={6}
                >
                  No products match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-gray-400">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Link
            href={buildHref({
              ...currentParams,
              page: String(Math.max(1, page - 1)),
            })}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest border rounded-sm ${
              page <= 1
                ? "pointer-events-none opacity-40 border-gray-200"
                : "border-gray-300"
            }`}
          >
            Prev
          </Link>
          <Link
            href={buildHref({
              ...currentParams,
              page: String(Math.min(totalPages, page + 1)),
            })}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest border rounded-sm ${
              page >= totalPages
                ? "pointer-events-none opacity-40 border-gray-200"
                : "border-gray-300"
            }`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
