import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './users/user.schema';
import { Tour } from './tours/tour.schema';

export async function seed() {
  console.log('🌱 Starting seed process...');
  console.log('📊 Environment:', process.env.NODE_ENV);
  console.log(
    '🔗 MongoDB URI:',
    process.env.MONGODB_URI?.replace(/\/\/.*:.*@/, '//***:***@'),
  );

  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('✅ Application context created');

  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const tourModel = app.get<Model<Tour>>(getModelToken(Tour.name));
  console.log('✅ Models loaded');

  // Clear existing data
  console.log('🗑️ Clearing existing data...');
  await userModel.deleteMany({});
  await tourModel.deleteMany({});
  console.log('✅ Existing data cleared');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await userModel.create({
    name: 'Admin User',
    email: 'admin@travel.com',
    password: adminPassword,
    role: 'admin',
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  await userModel.create({
    name: 'John Doe',
    email: 'user@travel.com',
    password: userPassword,
    role: 'user',
  });

  // Create sample tours
  const tours = [
    // Budget Tours (Under $500)
    {
      title: 'Hanoi Street Food Adventure',
      description:
        'Discover authentic Vietnamese cuisine with a guided street food tour through Old Quarter. Taste pho, banh mi, and local delicacies.',
      price: 89,
      duration: 3,
      location: 'Hanoi, Vietnam',
      images: [
        'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800',
      ],
    },
    {
      title: 'Hoi An Ancient Town Explorer',
      description:
        'Walk through lantern-lit streets, visit traditional craft villages, and enjoy cooking classes in this UNESCO site.',
      price: 149,
      duration: 4,
      location: 'Hoi An, Vietnam',
      images: [
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?w=800',
      ],
    },
    {
      title: 'Sapa Mountain Trekking',
      description:
        'Experience breathtaking terraced rice fields and stay with local ethnic minorities in traditional homestays.',
      price: 199,
      duration: 3,
      location: 'Sapa, Vietnam',
      images: [
        'https://images.unsplash.com/photo-1464822759844-d150baef493e?w=800',
      ],
    },
    {
      title: 'Mekong Delta Discovery',
      description:
        'Cruise through floating markets, visit fruit orchards, and experience rural life in the Mekong Delta.',
      price: 129,
      duration: 2,
      location: 'Can Tho, Vietnam',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ],
    },
    {
      title: 'Da Nang Beach Getaway',
      description:
        'Relax on golden beaches, visit Marble Mountains, and explore the famous Golden Bridge.',
      price: 179,
      duration: 4,
      location: 'Da Nang, Vietnam',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ],
    },
    {
      title: 'Ha Long Bay Cruise',
      description:
        'Sail through emerald waters and limestone karsts in this UNESCO World Heritage site.',
      price: 249,
      duration: 2,
      location: 'Ha Long Bay, Vietnam',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ],
    },
    {
      title: 'Phong Nha Cave Exploration',
      description:
        "Discover magnificent underground rivers and caverns in one of the world's largest cave systems.",
      price: 169,
      duration: 3,
      location: 'Phong Nha, Vietnam',
      images: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      ],
    },
    {
      title: 'Bangkok Temple Hopping',
      description:
        "Visit stunning temples, explore floating markets, and experience vibrant street life in Thailand's capital.",
      price: 159,
      duration: 3,
      location: 'Bangkok, Thailand',
      images: [
        'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
      ],
    },
    {
      title: 'Chiang Mai Cultural Immersion',
      description:
        'Learn traditional crafts, visit elephant sanctuaries, and explore hill tribe villages.',
      price: 219,
      duration: 4,
      location: 'Chiang Mai, Thailand',
      images: [
        'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
      ],
    },
    {
      title: 'Phuket Island Paradise',
      description:
        "Enjoy pristine beaches, snorkeling, and vibrant nightlife on Thailand's largest island.",
      price: 289,
      duration: 5,
      location: 'Phuket, Thailand',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ],
    },

    // Mid-range Tours ($500-1000)
    {
      title: 'Amazing Bali Adventure',
      description:
        'Explore beautiful beaches, ancient temples, and rice terraces. Experience Balinese culture and warm hospitality.',
      price: 599,
      duration: 7,
      location: 'Bali, Indonesia',
      images: [
        'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800',
      ],
    },
    {
      title: 'Angkor Wat Heritage Tour',
      description:
        'Discover the magnificent temples of Angkor, experience Khmer culture, and explore Siem Reap.',
      price: 449,
      duration: 5,
      location: 'Siem Reap, Cambodia',
      images: [
        'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800',
      ],
    },
    {
      title: 'Tokyo City Explorer',
      description:
        'Discover vibrant Tokyo with modern skyscrapers, traditional temples, and amazing cuisine.',
      price: 899,
      duration: 6,
      location: 'Tokyo, Japan',
      images: [
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      ],
    },
    {
      title: 'Seoul K-Culture Experience',
      description:
        'Immerse in Korean culture, visit palaces, enjoy K-BBQ, and explore trendy neighborhoods.',
      price: 699,
      duration: 5,
      location: 'Seoul, South Korea',
      images: [
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      ],
    },
    {
      title: 'Singapore City Safari',
      description:
        'Experience diverse cultures, amazing food, Gardens by the Bay, and modern attractions.',
      price: 649,
      duration: 4,
      location: 'Singapore',
      images: [
        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
      ],
    },
    {
      title: 'Kuala Lumpur Urban Discovery',
      description:
        'Explore iconic Petronas Towers, vibrant street food scene, and multicultural neighborhoods.',
      price: 399,
      duration: 4,
      location: 'Kuala Lumpur, Malaysia',
      images: [
        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
      ],
    },
    {
      title: 'Yangon Golden Pagoda Tour',
      description:
        'Visit the magnificent Shwedagon Pagoda, explore colonial architecture, and experience local markets.',
      price: 329,
      duration: 4,
      location: 'Yangon, Myanmar',
      images: [
        'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800',
      ],
    },
    {
      title: 'Luang Prabang Spiritual Journey',
      description:
        'Experience ancient temples, participate in alms giving, and enjoy the peaceful atmosphere.',
      price: 459,
      duration: 5,
      location: 'Luang Prabang, Laos',
      images: [
        'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800',
      ],
    },

    // Premium Tours ($1000+)
    {
      title: 'Santorini Sunset Romance',
      description:
        "Experience magical sunsets, white-washed buildings, and crystal blue waters in Greece's most romantic island.",
      price: 1199,
      duration: 6,
      location: 'Santorini, Greece',
      images: [
        'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
      ],
    },
    {
      title: 'Swiss Alps Mountain Trek',
      description:
        'Breathtaking mountain views, pristine alpine lakes, and charming villages await you.',
      price: 1599,
      duration: 8,
      location: 'Swiss Alps, Switzerland',
      images: [
        'https://images.unsplash.com/photo-1464822759844-d150baef493e?w=800',
      ],
    },
    {
      title: 'Iceland Northern Lights',
      description:
        'Chase the Aurora Borealis while exploring glaciers, geysers, and volcanic landscapes.',
      price: 1499,
      duration: 7,
      location: 'Reykjavik, Iceland',
      images: [
        'https://images.unsplash.com/photo-1539066176691-d39e2a4cdb36?w=800',
      ],
    },
    {
      title: 'Morocco Desert Expedition',
      description:
        'Journey through ancient medinas, ride camels across sand dunes, and sleep under starry skies.',
      price: 999,
      duration: 9,
      location: 'Marrakech, Morocco',
      images: [
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800',
      ],
    },
    {
      title: 'Machu Picchu Trek',
      description:
        "Follow ancient Inca trails to reach the lost city, one of the world's greatest archaeological sites.",
      price: 1299,
      duration: 7,
      location: 'Cusco, Peru',
      images: [
        'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
      ],
    },
    {
      title: 'Egyptian Pyramids Journey',
      description:
        'Explore ancient pyramids, cruise the Nile, and discover the mysteries of pharaohs.',
      price: 1399,
      duration: 10,
      location: 'Cairo, Egypt',
      images: [
        'https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?w=800',
      ],
    },
    {
      title: 'Dubai Luxury Escape',
      description:
        'Experience ultra-modern luxury with world-class shopping, fine dining, and architectural marvels.',
      price: 1699,
      duration: 5,
      location: 'Dubai, UAE',
      images: [
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
      ],
    },
    {
      title: 'Maldives Paradise Retreat',
      description:
        'Ultimate tropical paradise with overwater bungalows, pristine beaches, and world-class diving.',
      price: 2299,
      duration: 8,
      location: 'Maldives',
      images: [
        'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800',
      ],
    },
    {
      title: 'African Safari Adventure',
      description:
        'Witness the Big Five in their natural habitat and experience the raw beauty of African wilderness.',
      price: 2199,
      duration: 12,
      location: 'Serengeti, Tanzania',
      images: [
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      ],
    },
    {
      title: 'Norwegian Fjords Cruise',
      description:
        "Sail through dramatic fjords, past waterfalls and snow-capped peaks in nature's most spectacular setting.",
      price: 1999,
      duration: 11,
      location: 'Bergen, Norway',
      images: [
        'https://images.unsplash.com/photo-1601439678777-b2b3c56fa627?w=800',
      ],
    },
    {
      title: 'Amazon Rainforest Expedition',
      description:
        "Discover the world's largest rainforest, exotic wildlife, and indigenous cultures.",
      price: 1399,
      duration: 9,
      location: 'Amazon Basin, Brazil',
      images: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      ],
    },
    {
      title: 'New York City Break',
      description:
        'Experience the city that never sleeps. Visit iconic landmarks, Broadway shows, and world-class museums.',
      price: 899,
      duration: 4,
      location: 'New York, USA',
      images: [
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      ],
    },
    {
      title: 'European Cultural Tour',
      description:
        'Visit the most beautiful cities in Europe: Paris, Rome, Barcelona, and Amsterdam in one journey.',
      price: 1899,
      duration: 14,
      location: 'Europe',
      images: [
        'https://images.unsplash.com/photo-1471919743851-c4df8b6ee5d5?w=800',
      ],
    },
    {
      title: 'Australian Outback Adventure',
      description:
        'Explore the rugged beauty of the Outback, visit Uluru, and experience Aboriginal culture.',
      price: 1799,
      duration: 10,
      location: 'Northern Territory, Australia',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ],
    },
    {
      title: 'Canadian Rockies Explorer',
      description:
        "Discover pristine wilderness, turquoise lakes, and towering peaks in Canada's most beautiful parks.",
      price: 1499,
      duration: 9,
      location: 'Banff, Canada',
      images: [
        'https://images.unsplash.com/photo-1464822759844-d150baef493e?w=800',
      ],
    },
    {
      title: 'China Ancient Wonders',
      description:
        'Walk the Great Wall, explore the Forbidden City, and discover terracotta warriors.',
      price: 1599,
      duration: 12,
      location: 'Beijing, China',
      images: [
        'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
      ],
    },
    {
      title: 'Costa Rica Eco Adventure',
      description:
        'Experience incredible biodiversity with zip-lining, wildlife spotting, and pristine beaches.',
      price: 1199,
      duration: 8,
      location: 'San José, Costa Rica',
      images: [
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
      ],
    },
  ];

  await tourModel.insertMany(tours);

  console.log('✅ Database seeded successfully!');
  console.log('📧 Admin: admin@travel.com / admin123');
  console.log('📧 User: user@travel.com / user123');

  await app.close();
}

// Run seed if called directly
if (require.main === module) {
  seed().catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
}
