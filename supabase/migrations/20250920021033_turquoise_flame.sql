/*
  # Add Sample Article for Today

  1. New Data
    - Insert a sample environmental article for today's date
    - Article about sustainable fashion and its environmental impact
    - Includes key takeaways and proper formatting
  
  2. Content
    - Title: "The Hidden Environmental Cost of Fast Fashion"
    - Subtitle about textile industry impact
    - Full article content with actionable insights
    - Key takeaways for reader engagement
*/

INSERT INTO articles (
  title,
  subtitle,
  content,
  category,
  published_date,
  reading_time,
  is_published,
  key_takeaways
) VALUES (
  'The Hidden Environmental Cost of Fast Fashion',
  'How the textile industry became one of the world''s largest polluters and what you can do about it',
  '<p>Every year, the fashion industry produces over 100 billion garments worldwide, yet the average piece of clothing is worn only 7-10 times before being discarded. This staggering statistic reveals just the tip of the iceberg when it comes to fashion''s environmental impact.</p>

<p>The textile industry is responsible for approximately 10% of global carbon emissions—more than international flights and maritime shipping combined. The production of a single cotton t-shirt requires about 2,700 liters of water, enough for one person to drink for 2.5 years.</p>

<h3>The Water Crisis</h3>
<p>Cotton cultivation alone accounts for 16% of global insecticide use, despite covering only 2.4% of the world''s cropland. These chemicals contaminate water sources, affecting both human health and aquatic ecosystems. In countries like India and China, where much of our clothing is produced, textile dyeing is the second-largest polluter of clean water.</p>

<h3>The Microplastic Problem</h3>
<p>Synthetic fabrics like polyester shed microplastics with every wash. A single load of laundry can release up to 700,000 microplastic fibers into waterways, eventually making their way into our food chain and even our drinking water.</p>

<h3>Labor and Social Impact</h3>
<p>Beyond environmental concerns, fast fashion perpetuates poor working conditions and unfair wages in developing countries. The true cost of that $5 t-shirt includes human exploitation and environmental degradation that isn''t reflected in the price tag.</p>

<h3>Solutions Within Reach</h3>
<p>The good news? Small changes in our shopping habits can make a significant difference:</p>

<ul>
<li><strong>Buy less, choose well:</strong> Invest in quality pieces that last longer</li>
<li><strong>Support sustainable brands:</strong> Look for certifications like GOTS, OEKO-TEX, or B-Corp</li>
<li><strong>Embrace secondhand:</strong> Thrift stores and online resale platforms offer unique finds</li>
<li><strong>Care properly:</strong> Wash clothes in cold water and air dry when possible</li>
<li><strong>Repair and upcycle:</strong> Learn basic sewing skills to extend garment life</li>
</ul>

<p>The fashion industry is slowly responding to consumer demand for sustainability, but real change happens when we vote with our wallets. Every purchase is an opportunity to support practices that align with our environmental values.</p>',
  'Sustainable Living',
  CURRENT_DATE,
  6,
  true,
  ARRAY[
    'The fashion industry produces 10% of global carbon emissions, more than flights and shipping combined',
    'A single cotton t-shirt requires 2,700 liters of water to produce',
    'Synthetic fabrics release up to 700,000 microplastic fibers per wash load',
    'Buying quality over quantity and supporting sustainable brands can significantly reduce your fashion footprint',
    'Simple care practices like cold water washing and air drying extend garment life and reduce environmental impact'
  ]
);