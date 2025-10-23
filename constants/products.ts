export interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "lanterns-ch",
    title: "Lanterns - Chinese Culture 🇨🇳",
    image: "https://storage.worldfriends.app/lamp.ch-c",
    price: 0.99,
    description: "Beautiful traditional Chinese lanterns that bring warmth and cultural elegance to any space.",
  },
  {
    id: "wind-chimes-jp",
    title: "Wind Chime - Japanese Culture 🇯🇵",
    image: "https://storage.worldfriends.app/wind-chimes.jp-c",
    price: 1.99,
    description: "Authentic Japanese wind chimes that create peaceful melodies with every gentle breeze.",
  },
  {
    id: "korean-doll-ko",
    title: "Doll - Korean Culture 🇰🇷",
    image: "https://storage.worldfriends.app/korean-doll.png",
    price: 2.99,
    description: "Traditional Korean doll representing the rich cultural heritage and craftsmanship of Korea.",
  },
  {
    id: "batman",
    title: "Batman Badge",
    image: "https://storage.worldfriends.app/batman-badge",
    price: 2.99,
    description: "Iconic Batman badge for superhero fans and collectors alike.",
  },
];

export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find((product) => product.id === id);
};