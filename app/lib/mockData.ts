import { Category, Product, Feature } from './types';

export const features: Feature[] = [
  {
    id: '1',
    title: 'Free Delivery',
    subtitle: 'Orders over $20',
    iconName: 'delivery'
  },
  {
    id: '2',
    title: '100% Organic',
    subtitle: 'Certified products',
    iconName: 'organic'
  },
  {
    id: '3',
    title: 'Same Day',
    subtitle: 'Express delivery',
    iconName: 'delivery-time'
  },
  {
    id: '4',
    title: 'Secure Pay',
    subtitle: 'Safe checkout',
    iconName: 'secure-pay'
  }
];

export const categories: Category[] = [
  {
    id: '1',
    name: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1610397613090-a0206a3fcc40?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    name: 'Personal Care',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: '3',
    name: 'Pantry Staples',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: '4',
    name: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: '5',
    name: 'Beverages',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: '6',
    name: 'Meat & Seafood',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: '7',
    name: 'Snacks',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527ec087?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: '8',
    name: 'Frozen Foods',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: '9',
    name: 'Baby Care',
    image: 'https://images.unsplash.com/photo-1522850959076-32e77bb5f64a?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: '10',
    name: 'Dairy & Eggs',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=120&auto=format&fit=crop&q=80'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Cheese 200g',
    rating: 4.5,
    ratingCount: 12,
    price: 130.0,
    unit: '200g',
    originalPrice: 140.0,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    name: 'Knorr Cup Soup 70g',
    rating: 4.5,
    ratingCount: 12,
    price: 30.0,
    unit: '70g',
    originalPrice: 35.0,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1547592165-e1d17f1a0655?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '3',
    name: 'Fanta 1.5L',
    rating: 4.5,
    ratingCount: 12,
    price: 65.0,
    unit: '1.5L',
    originalPrice: 70.0,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '4',
    name: 'Basmati Rice 5kg',
    rating: 4.5,
    ratingCount: 12,
    price: 520.0,
    unit: '5kg',
    originalPrice: 550.0,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '5',
    name: 'Carrot 500g',
    rating: 4.5,
    ratingCount: 12,
    price: 44.0,
    unit: '500g',
    originalPrice: 50.0,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '6',
    name: 'Banana 1 kg',
    rating: 4.5,
    ratingCount: 12,
    price: 45.0,
    unit: '1kg',
    originalPrice: 50.0,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '7',
    name: 'Onion 500g',
    rating: 4.5,
    ratingCount: 12,
    price: 45.0,
    unit: '500g',
    originalPrice: 50.0,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1508747703725-7197771375e0?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '8',
    name: 'Grapes 500g',
    rating: 4.5,
    ratingCount: 12,
    price: 65.0,
    unit: '500g',
    originalPrice: 70.0,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '9',
    name: 'Maggi Noodles 280g',
    rating: 4.5,
    ratingCount: 12,
    price: 40.0,
    unit: '280g',
    originalPrice: 55.0,
    discount: 27,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '10',
    name: 'Sprite 1.5L',
    rating: 4.5,
    ratingCount: 12,
    price: 60.0,
    unit: '1.5L',
    originalPrice: 75.0,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1625772290748-39093c399e2e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '11',
    name: 'Potato 500g',
    rating: 4.5,
    ratingCount: 12,
    price: 35.0,
    unit: '500g',
    originalPrice: 40.0,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '12',
    name: 'Barley 1kg',
    rating: 4.5,
    ratingCount: 12,
    price: 140.0,
    unit: '1kg',
    originalPrice: 150.0,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '13',
    name: '7 Up 1.5L',
    rating: 4.5,
    ratingCount: 12,
    price: 70.0,
    unit: '1.5L',
    originalPrice: 76.0,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '14',
    name: 'Paneer 200g',
    rating: 4.5,
    ratingCount: 12,
    price: 85.0,
    unit: '200g',
    originalPrice: 90.0,
    discount: 6,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '15',
    name: 'Amul Milk 1L',
    rating: 4.5,
    ratingCount: 12,
    price: 55.0,
    unit: '1L',
    originalPrice: 60.0,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '16',
    name: 'Eggs 12 pcs',
    rating: 4.5,
    ratingCount: 12,
    price: 85.0,
    unit: '12pcs',
    originalPrice: 90.0,
    discount: 6,
    image: 'https://images.unsplash.com/photo-1516448424440-9dbca97779c1?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '17',
    name: 'Brown Rice 1kg',
    rating: 4.5,
    ratingCount: 12,
    price: 110.0,
    unit: '1kg',
    originalPrice: 120.0,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '18',
    name: 'Strawberry 250g',
    rating: 4.8,
    ratingCount: 19,
    price: 120.0,
    unit: '250g',
    originalPrice: 135.0,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '19',
    name: 'Whole Wheat Bread',
    rating: 4.4,
    ratingCount: 8,
    price: 45.0,
    unit: '400g',
    originalPrice: 48.0,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '20',
    name: 'Apple Gala 1kg',
    rating: 4.6,
    ratingCount: 22,
    price: 170.0,
    unit: '1kg',
    originalPrice: 200.0,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '21',
    name: 'Greek Yogurt 500g',
    rating: 4.7,
    ratingCount: 15,
    price: 80.0,
    unit: '500g',
    originalPrice: 91.0,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '22',
    name: 'Organic Honey 500g',
    rating: 4.9,
    ratingCount: 30,
    price: 270.0,
    unit: '500g',
    originalPrice: 300.0,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '23',
    name: 'Toilet Paper 12 rolls',
    rating: 4.3,
    ratingCount: 6,
    price: 240.0,
    unit: '12rolls',
    originalPrice: 300.0,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '24',
    name: 'Orange Juice 1L',
    rating: 4.5,
    ratingCount: 10,
    price: 90.0,
    unit: '1L',
    originalPrice: 100.0,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '25',
    name: 'Salmon Fillet 250g',
    rating: 4.8,
    ratingCount: 14,
    price: 368.0,
    unit: '250g',
    originalPrice: 400.0,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '26',
    name: 'Wheat Flour 5kg',
    rating: 4.5,
    ratingCount: 12,
    price: 230.0,
    unit: '5kg',
    originalPrice: 250.0,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '27',
    name: 'Apple 1 kg',
    rating: 4.5,
    ratingCount: 12,
    price: 90.0,
    unit: '1kg',
    originalPrice: 100.0,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '28',
    name: 'Coca-Cola 1.5L',
    rating: 4.5,
    ratingCount: 12,
    price: 75.0,
    unit: '1.5L',
    originalPrice: 80.0,
    discount: 6,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: '29',
    name: 'Orange 1 kg',
    rating: 4.5,
    ratingCount: 12,
    price: 75.0,
    unit: '1kg',
    originalPrice: 80.0,
    discount: 6,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=300&auto=format&fit=crop&q=80'
  }
];
