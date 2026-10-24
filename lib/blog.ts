export type BlogSection = {
  id: string;
  brand: string;
  title: string;
  order: string;
  paragraphs: string[];
  sourceLabel: string;
  sourceUrl: string;
  orderingNote: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  author: string;
  authorAge: number;
  publishedAt: string;
  displayDate: string;
  readTime: string;
  category: string;
  heroLabel: string;
  intro: string[];
  sections: BlogSection[];
  closingTitle: string;
  closing: string[];
  parentNote: string;
  sourcesCheckedAt: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: '3-brands-i-love-for-gluten-free-food',
    title: '3 The Named Brands That I Love For Gluten-Free Food',
    description:
      'Ari, aged 10, shares his gluten-free favourites at PizzaExpress, Nando’s and Wagamama: dough balls, pizza, a brownie, wings and noodles with chicken.',
    excerpt:
      'Dough balls, pizza and a brownie. Chicken wings. A bowl of noodles. I’m Ari, I’m 10, and these are three places I love to eat.',
    author: 'Ari',
    authorAge: 10,
    publishedAt: '2026-10-24',
    displayDate: '24 October 2026',
    readTime: '3 min read',
    category: 'Eating out',
    heroLabel: 'My first food note',
    intro: [
      'Hi, I’m Ari. I’m 10 and I eat gluten-free. Welcome to my first blog! I thought a good place to start would be with something very important: food I actually love eating.',
      'My three choices are PizzaExpress, Nando’s and Wagamama. They all have something different that I enjoy. Sometimes it’s pizza, sometimes it’s wings, and sometimes it’s noodles with chicken.',
      'This isn’t a list of everything on their menus. It’s my little list of favourites. Here’s what I like to order.',
    ],
    sections: [
      {
        id: 'pizzaexpress',
        brand: 'PizzaExpress',
        title: 'PizzaExpress: three courses of delicious',
        order: 'Gluten-free kids’ meal: dough balls, pizza and a brownie.',
        paragraphs: [
          'At PizzaExpress, I love the gluten-free kids’ meal. You get dough balls, pizza and a brownie. All gluten-free. All delicious.',
          'First come the dough balls. Then there’s the pizza. And when you’ve finished that, there’s still a brownie to look forward to. That is a very good order of events, if you ask me.',
          'The thing I really like is that it’s a whole meal. I get a starter, a main and a proper pudding at the end. The brownie definitely belongs in this blog, even though it isn’t a pizza.',
          'So if someone asks what I like at PizzaExpress, my answer is all three. Please don’t make me choose between the pizza and the brownie!',
        ],
        sourceLabel: 'PizzaExpress allergen and menu information',
        sourceUrl: 'https://www.pizzaexpress.com/allergens-and-nutritionals',
        orderingNote:
          'PizzaExpress offers gluten-free options on its Piccolo children’s menu. Ask for the gluten-free versions when ordering and check the current menu for your restaurant.',
      },
      {
        id: 'nandos',
        brand: 'Nando’s',
        title: 'Nando’s: it’s the wings for me',
        order: 'Chicken wings.',
        paragraphs: [
          'At Nando’s, my favourite is the wings. This is the chicken part of my list, and it deserves its place.',
          'I like having a different choice from pizza. A list of favourites would be a bit boring if every single one was exactly the same meal. Wings are what I look forward to at Nando’s.',
          'I could try to write a very fancy restaurant review here. But I’m 10, and the main thing I want to tell you is that I really like the wings. That’s why Nando’s is one of my three.',
        ],
        sourceLabel: 'Nando’s Chicken Wings allergen information',
        sourceUrl: 'https://www.nandos.co.uk/allergens/nandos-chicken-wings',
        orderingNote:
          'Nando’s current standard Chicken Wings entry does not list gluten in its allergen or may-contain columns. The kitchen handles allergens: speak to the manager and check the exact wings, basting sauce and any sides before ordering.',
      },
      {
        id: 'wagamama',
        brand: 'Wagamama',
        title: 'Wagamama: noodles, please',
        order: 'Gluten-free noodles with chicken.',
        paragraphs: [
          'At Wagamama, I like the gluten-free noodles and some chicken. If I’m in the mood for noodles, this is the choice on my list.',
          'I know I’ve already put chicken in the Nando’s bit. But chicken with noodles is a different meal from wings, so I think both are allowed. It’s my first blog. I’m making that rule.',
          'I like that my three favourites give me a choice: a pizza meal, wings, or noodles with chicken. Eating gluten-free is part of my life, and it’s good to have different meals that I enjoy.',
        ],
        sourceLabel: 'Wagamama allergen and non-gluten information',
        sourceUrl: 'https://www.wagamama.com/allergen-information',
        orderingNote:
          'Wagamama describes its suitable menu options as “non-gluten” dishes. Tell your server about your dietary needs on every visit and ask which noodle-and-chicken dish they can prepare for you; ingredients, adaptations and cross-contact warnings vary.',
      },
    ],
    closingTitle: 'Three places. Three happy choices.',
    closing: [
      'Those are my first three picks: PizzaExpress for the gluten-free kids’ meal, Nando’s for wings, and Wagamama for gluten-free noodles with chicken.',
      'I’m not going to pick one winner. They’re different, and I love having a choice. Thanks for reading my first blog. — Ari',
    ],
    parentNote:
      'These are Ari’s personal favourites. Menus, ingredients and preparation can change, and restaurants use shared kitchens. Tell the team that you need gluten-free food before ordering, and check the exact dish, sauces, sides and preparation on every visit.',
    sourcesCheckedAt: '24 October 2026',
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
