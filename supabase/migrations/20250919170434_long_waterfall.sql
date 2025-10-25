/*
  # Insert sample articles for The Climate Note

  1. Sample Data
    - Add sample environmental articles with different categories
    - Include key takeaways for sticky note summaries
    - Set realistic reading times and publication dates

  2. Categories
    - Current Issues
    - Daily Actions
    - Fast Fashion
    - Sustainable Living
*/

INSERT INTO articles (title, subtitle, content, category, published_date, reading_time, is_published, key_takeaways) VALUES
(
  'The Hidden Environmental Cost of Fast Fashion Returns',
  'Every year, billions of returned clothes end up in landfills. Here''s what most people don''t know about the reverse supply chain.',
  '<p>When you click "return" on that online purchase, you might think the item simply goes back to the warehouse to be resold. The reality is far more complex and environmentally damaging.</p>

  <p>According to recent industry reports, up to 25% of returned items never make it back to store shelves. Instead, they''re sent directly to landfills or incineration facilities. This happens because the cost of processing, cleaning, and restocking returned items often exceeds their resale value.</p>

  <p>The environmental impact is staggering. In 2023 alone, returned merchandise generated an estimated 16 million tons of CO2 emissions and 5.8 billion pounds of landfill waste. That''s equivalent to the annual emissions of 3.5 million cars.</p>

  <p>But here''s what''s particularly troubling: many of these returns are perfectly good items. A study by the National Retail Federation found that 68% of returns are due to sizing issues, buyer''s remorse, or simply ordering multiple sizes with the intention of returning most of them.</p>

  <p>Some companies are fighting back with innovative solutions. Patagonia''s Worn Wear program refurbishes returned items, while others are investing in AI-powered sizing tools to reduce returns in the first place. But as consumers, we have more power than we realize to address this crisis.</p>',
  'Fast Fashion',
  '2025-01-15',
  6,
  true,
  ARRAY[
    'Up to 25% of returned fashion items end up in landfills, not back on shelves',
    'Returns generated 16 million tons of CO2 emissions in 2023 alone',
    'Most returns are due to sizing issues that could be prevented with better research'
  ]
),
(
  'Microplastics in Your Morning Coffee: The Surprising Source',
  'New research reveals that single-use coffee pods release 11.7 billion microplastic particles per cup. Here''s what you need to know.',
  '<p>Your morning coffee ritual might be serving up more than just caffeine. Groundbreaking research from McGill University has found that single-use coffee pods release an average of 11.7 billion microplastic particles and 5.8 billion nanoplastic particles per cup.</p>

  <p>To put this in perspective, that''s 1,000 times more microplastics than what''s typically found in other food and beverages. These microscopic particles come from the plastic pods themselves, which break down under the high heat and pressure of brewing.</p>

  <p>The health implications are still being studied, but early research suggests that microplastics can accumulate in human tissues and potentially disrupt hormonal systems. What''s more concerning is that we''re only beginning to understand the long-term effects of chronic microplastic exposure.</p>

  <p>The environmental impact extends beyond our bodies. Coffee pods are notoriously difficult to recycle due to their mixed materials – plastic, aluminum, and organic waste all fused together. Despite recycling programs from major manufacturers, less than 5% of pods are actually recycled.</p>

  <p>But there''s hope. French press, pour-over, and traditional drip coffee makers produce virtually no microplastics. Some companies are also developing compostable pods made from plant-based materials, though these are still in early stages of adoption.</p>',
  'Current Issues',
  '2025-01-14',
  5,
  true,
  ARRAY[
    'Coffee pods release 11.7 billion microplastic particles per cup',
    'Less than 5% of coffee pods are actually recycled despite programs',
    'Traditional brewing methods like French press produce virtually no microplastics'
  ]
),
(
  'The 15-Minute Rule That Could Transform Your Environmental Impact',
  'A simple daily practice that environmental psychologists say can reduce your carbon footprint by up to 20% within six months.',
  '<p>What if I told you that spending just 15 minutes a day on one simple practice could reduce your environmental impact by 20% within six months? It sounds too good to be true, but environmental psychologists at Stanford University have been studying this phenomenon for three years.</p>

  <p>The practice is called "mindful consumption tracking" – and it''s not what you think. It''s not about obsessively calculating your carbon footprint or feeling guilty about every purchase. Instead, it''s about developing awareness of your consumption patterns through a simple daily reflection.</p>

  <p>Here''s how it works: Every evening, spend 15 minutes writing down three things you consumed that day (food, products, services, energy) and asking yourself two questions: "Did I really need this?" and "Could I have chosen a more sustainable alternative?"</p>

  <p>The magic happens not in the moment of reflection, but in how this practice rewires your brain for future decisions. Participants in the Stanford study found that after just two weeks, they naturally started making more sustainable choices without conscious effort.</p>

  <p>Dr. Sarah Chen, who led the research, explains: "We''re not asking people to become environmental saints overnight. We''re simply building awareness. When you start noticing your patterns, you naturally begin to shift them."</p>

  <p>The results speak for themselves. Study participants reduced their household waste by 32%, cut their energy consumption by 18%, and decreased their transportation emissions by 15% – all while reporting higher levels of life satisfaction.</p>',
  'Daily Actions',
  '2025-01-13',
  7,
  true,
  ARRAY[
    'Daily 15-minute consumption reflection can reduce environmental impact by 20%',
    'Awareness-building naturally leads to better choices without forced restrictions',
    'Participants reduced waste by 32% and energy use by 18% in the Stanford study'
  ]
),
(
  'Why Your Reusable Water Bottle Might Be Making Things Worse',
  'The uncomfortable truth about reusable bottles that the sustainability movement doesn''t want to discuss.',
  '<p>Before you grab your trusty reusable water bottle and feel good about saving the planet, there''s an uncomfortable truth we need to discuss. That bottle might actually be contributing to environmental problems in ways you''ve never considered.</p>

  <p>The issue isn''t with reusable bottles themselves – it''s with how we use them. A lifecycle analysis by the University of California found that the average reusable bottle needs to be used 1,000 times to offset its environmental impact compared to single-use plastic bottles.</p>

  <p>Here''s the problem: most people don''t use their reusable bottles nearly enough. Survey data shows that the average person owns 4.3 reusable water bottles but uses each one only 2-3 times per week. At that rate, it would take over 6 years to break even environmentally – and most bottles are replaced long before then.</p>

  <p>Then there''s the washing factor. Many reusable bottles require hot water and soap for proper cleaning, especially insulated models. If you''re washing your bottle daily with hot water, the energy consumption can actually exceed the environmental savings, particularly in areas where electricity comes from fossil fuels.</p>

  <p>But don''t throw away your reusable bottle just yet. The solution is simple: use it more consistently and wash it more efficiently. Aim to use the same bottle every day for at least two years. When washing, use cold water when possible and let it air dry instead of using a heated dishwasher cycle.</p>',
  'Sustainable Living',
  '2025-01-12',
  6,
  true,
  ARRAY[
    'Reusable bottles need 1,000+ uses to offset their environmental impact',
    'Average person owns 4.3 bottles but uses each only 2-3 times per week',
    'Consistent daily use for 2+ years and efficient washing makes them worthwhile'
  ]
);