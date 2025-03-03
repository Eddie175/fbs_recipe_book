/**
 * Recipe data for FBS Employee Recipe Book
 * Contains all the recipes shown in the application
 */

const recipes = [
    {
        title: "Beef Birria",
        author: "Ariadne",
        category: "main",
        ingredients: [
            "3 kg of beef short ribs (approximately)",
            "10 tomatoes",
            "1 onion",
            "10 or 12 garlic cloves",
            "1 large tablespoon of black pepper",
            "1 large tablespoon of allspice",
            "1 tablespoon of ground cumin",
            "2 tablespoons of dried thyme",
            "2 tablespoons of dried oregano",
            "1/2 stick of cinnamon",
            "3 large bay leaves",
            "5 ancho chiles",
            "8 guajillo chiles",
            "2 tablespoons of white vinegar",
            "1 liter of water"
        ],
        instructions: [
            "Marinade: Fry the tomatoes, onion, garlic, and chiles in vinegar. Boil with the water, then drain and blend until everything is well ground.",
            "In a pot, add 5 liters of water and bring it to a boil.",
            "Without turning off the heat, add the marinade.",
            "Add salt (3 pinches of salt).",
            "Once it boils, add the beef.",
            "Let it simmer on low heat for 2 hours or until the meat separates from the bone or falls apart.",
            "For spicy sauce: Boil 10 tomatillos, 10 árbol chiles, 2 pasilla chiles, and 2 liters of water for 3 minutes. Let rest for 10 minutes.",
            "Blend 3 garlic cloves, 1/4 onion with 1/2 cup of the cooking liquid. Add salt to taste."
        ],
        preview: "A delicious Mexican beef stew made with beef short ribs and a rich chile sauce."
    },
    {
        title: "French Toast",
        author: "Kendra",
        category: "breakfast",
        ingredients: [
            "3 large eggs",
            "1T vanilla extract",
            "2t packed brown sugar",
            "1/2t ground cinnamon",
            "1/4t salt",
            "2T butter, melted (Half a stick)",
            "1c milk",
            "8 slices hearty white sandwich bread (~4\"x6\" slices that are somewhat sturdy)"
        ],
        instructions: [
            "Preheat oven to 425°F with one rack at the bottom and another ready under the broiler.",
            "Spray a half sheet pan well with cooking spray.",
            "Whisk together first five ingredients. Drizzle in butter while still whisking, then whisk in the milk.",
            "Pour the custard mixture into the sheet pan.",
            "Place bread slice by slice onto the pan, then start back at the beginning and immediately flip the pieces over in the order they were placed.",
            "Let the bread soak up the remaining custard.",
            "Place pan on the bottom rack and bake until the bottom sides are nicely browned, 12-15 minutes.",
            "Move the pan to the broiler rack and turn the broiler on its highest setting. Cook until the tops are nicely browned, 1-4 minutes.",
            "Flip over each slice in the pan (the bottom is prettier and this helps the moisture redistribute) and serve with your favorite toppings.",
            "We like good salted butter and dark maple syrup."
        ],
        preview: "A delicious start to the morning on those rare days when we're all home."
    },
    {
        title: "Æbleskiver (Danish)",
        author: "Brandon",
        category: "breakfast",
        ingredients: [
            "4 cups Bisquick",
            "1 tsp salt",
            "4 cups buttermilk",
            "1 Tbsp oil (melted butter preferred)",
            "8 eggs",
            "Cinnamon",
            "1/4 cup sugar",
            "Syrup or jam for serving (chokecherry recommended)"
        ],
        instructions: [
            "Separate egg yolks from egg whites.",
            "Blend all ingredients except egg whites in a large mixing bowl.",
            "Beat egg whites until stiff peaks form.",
            "Gently fold the beaten egg whites into the batter.",
            "Prepare an Æbleskiver pan by adding 1/2 tsp oil to each cup.",
            "Heat pan to medium-high heat. Getting the right temperature is crucial.",
            "Fill each cup about 2/3 full with batter.",
            "As the batter starts to become firm, begin rotating the Æbleskivers.",
            "Use a nut pick to turn each Æbleskiver approximately 1/4 turn at a time.",
            "Continue cooking and turning until golden brown and cooked through.",
            "Serving tip: Use a food service bottle to inject syrup or jam into each Æbleskiver instead of pouring on top."
        ],
        preview: "Traditional Danish spherical pancakes ('apple slices' in Danish), with a crispy exterior and Yorkshire pudding-like interior. A festival favorite passed down from Grandma, best served injected with syrup or jam."
    },
    {
        title: "Pierogi",
        author: "Hadley",
        category: "side",
        ingredients: [
            "For dough:",
            "2 c flour",
            "~1/2 cup water",
            "1 egg",
            "1/2 t salt",
            "For filling:",
            "~16oz farmer's cheese (sometimes called twarog)",
            "1 egg",
            "1/2 t salt"
        ],
        instructions: [
            "Add the water to the flour slowly, to dial in the dough consistency.",
            "Then roll it out as thin as possible. And I mean THIN. I've started using a pasta roller on a kitchen aid to make this easier.",
            "Cut it into circles, fill with cheese mixture and crimp.",
            "Dump into a pot of boiling water, when they float, they're done. 5-10 minutes at most.",
            "We used to eat them right out of the pot, with melted butter and salt.",
            "Any extras can be saved and fried in butter until a little crispy.",
            "My grandmother would say any filling other than cheese or cabbage is sacrilege. So until very recently, I'd never even tried potato pierogi."
        ],
        preview: "My grandmother's pierogi recipe with farmer's cheese filling."
    },
    {
        title: "Pizza Dough",
        author: "Michael",
        category: "main",
        ingredients: [
            "28 ounces of bread flour (for about four thin-crust 10-inch pizzas)",
            "63% ice cold water",
            "0.55% instant dry yeast",
            "2% fine sea salt"
        ],
        instructions: [
            "Mix in (I use a Kitchenaid stand mixer but you can just use a bowl and some utensils and your hands, too) 63% ice cold water",
            "Mix in 0.55% instant dry yeast",
            "Mix in 2% fine sea salt",
            "Combine all the ingredients until a ball of dough forms and then continue mixing (if using a stand mixer) or hand-knead the dough until it is smooth and it passes the window-pane test",
            "Put the dough in a container with enough room to increase in size by 50% and then put it in the refrigerator for a day or even two. This Is called cold fermenting and is just a slower fermenting process than at higher temperatures.",
            "4-5 hours before you want to make pizza, take the dough out of the fridge and let it sit at room temperature to warm up for 2-3 hours",
            "Two hours before you want to make pizza, cut the dough into 9 oz pieces and form them into balls",
            "Now you're ready to bake and so you can google how to stretch the dough and move it from the counter into the oven. Lots of practice helps and you will make mistakes but it's still fun. And then you get to eat."
        ],
        preview: "High-heat pizza dough recipe using baker's percentages for consistency."
    },
    {
        title: "Pancakes from Scratch",
        author: "Eric",
        category: "breakfast",
        ingredients: [
            "Dry Ingredients:",
            "7 oz (by weight) All Purpose Flour - About 1 cup",
            "1 Tbsp Sugar",
            "2 Tsp Baking Powder",
            "1/2 Tsp Salt",
            "Wet Ingredients:",
            "1 1/4 Cup Milk",
            "1/2 Cup Buttermilk",
            "1 Egg",
            "4 Tbsp Butter, melted (Half a stick)",
            "1 Tsp Vanilla Extract"
        ],
        instructions: [
            "Combine dry ingredients in a mixing bowl.",
            "Whisk wet ingredients together, and add to the dry ingredients.",
            "Stir to combine, but don't over-stir. Some lumps in the batter are okay.",
            "Let sit for 5 minutes while the griddle heats.",
            "Ladle batter onto a 350 degree griddle, and cook for 2 minutes each side.",
            "Enjoy!"
        ],
        preview: "A delicious start to the morning on those rare days when we're all home."
    },
    {
        title: "Marshmallow Squares",
        author: "Melissa",
        category: "dessert",
        ingredients: [
            "12 oz butterscotch chips",
            "1/2 cup butter",
            "1 Cup of Peanut Butter",
            "1 package mini marshmallows",
            "3-4 cups Rice Krispies (More than 3 cups if you like more crunch)"
        ],
        instructions: [
            "Melt butterscotch chips and butter together",
            "Add 1 Cup of Peanut Butter, stir until melted",
            "In large bowl, pour over a mixture of 1 package mini marshmallows and 3-4 cups Rice Krispies",
            "Put in a 9x13 pan and chill in fridge. I like to line with parchment paper.",
            "I like to eat them cold."
        ],
        preview: "Super easy dessert to make when in a pinch and need to bring something to a potluck."
    },
    {    
        title: "Peanut Butter Cookies",
        author: "Stephanie",
        category: "dessert",
        ingredients: [
            "1 cup butter",
            "1 cup sugar",
            "1 cup brown sugar",
            "1 cup peanut butter",
            "1 tsp vanilla",
            "2 eggs",
            "3½ cups flour",
            "½ tsp salt",
            "1 tsp baking soda",
            "Snickers Minis (optional)"
        ],
        instructions: [
            "Mix butter, sugars, peanut butter, vanilla, and eggs until well combined.",
            "In a separate bowl, whisk together flour, salt, and baking soda.",
            "Gradually add dry ingredients to wet ingredients, mixing until just combined.",
            "Preheat oven to desired temperature:",
            "- 300°F: 10-12 minutes",
            "- 325°F: 15 minutes",
            "- 350°F: 12 minutes",
            "       ★ 13½ minutes",
            "For a large batch, this recipe makes approximately 90 cookies.",
            "Chill 2-3 hours."
        ],
        preview: "Classic peanut butter cookies with options to customize, including adding Snickers Minis."
    },
    {
        title: "Spicy Lasagna",
        author: "John",
        category: "main",
        ingredients: [
            "Lasagna noodles",
            "Meat sauce (hamburger and spicy Italian sausage)",
            "Regular spaghetti sauce blended with spicy arrabbiata sauce",
            "Mozzarella cheese",
            "Provolone cheese"
        ],
        instructions: [
            "Layer of noodles",
            "Layer of meat sauce (hamburger)",
            "Layer of mozzarella",
            "Layer of noodles",
            "Layer of meat sauce",
            "Layer of provolone",
            "Layer of noodles",
            "Layer of meat sauce",
            "Layer of mozzarella",
            "Layer of crumbled provolone"
        ],
        preview: "A spicier take on lasagna with Italian sausage and arrabbiata sauce."
    },
    {
        title: "Log Cabin Cocktail",
        author: "Tom",
        category: "drink",
        ingredients: [
            "1 oz apple brandy",
            "1 oz toasted hazelnut-infused bourbon (see recipe below)",
            "1 heavy teaspoon maple syrup",
            "2 dashes Angostura bitters",
            "1 dash Bitter Truth Jerry Thomas Decanter Bitters (or another baking spice bitters)",
            "Orange peel for garnish",
            "For the hazelnut-infused bourbon:",
            "1 cup blanched hazelnuts",
            "2 cups bourbon (90-100 proof preferred)"
        ],
        instructions: [
            "For the cocktail:",
            "Combine all ingredients in a mixing glass.",
            "Fill with ice, stir for 15-30 seconds.",
            "Strain into a chilled rocks glass over ice (preferably 1 large cube), or build and stir in rocks glass.",
            "Express oils from orange peel and use as garnish.",
            "For the hazelnut-infused bourbon:",
            "Preheat oven to 350°F. Spread hazelnuts on a baking pan.",
            "Toast hazelnuts 8-10 minutes until fragrant and light brown. Watch carefully to prevent burning.",
            "Combine warm hazelnuts and bourbon in a covered container.",
            "Infuse at room temperature for minimum 3 days, but preferably a week or longer for more flavor.",
            "Quick infusion tip: For 24-hour infusion, use equal parts hot hazelnuts and bourbon (though this requires more nuts)."
        ],
        preview: "A sophisticated cocktail featuring homemade hazelnut-infused bourbon, apple brandy, and maple syrup."
    },
    {
        title: "South American Style Marinated Chicken Legs",
        author: "David",
        category: "main",
        ingredients: [
            "1 Cup Soy Sauce",
            "1/3 Cup Distilled Vinegar",
            "1 Tablespoon Tomato Paste",
            "1 Teaspoon Cayenne Pepper",
            "1 Teaspoon Dried Sage",
            "1 Teaspoon Cumin",
            "1 Teaspoon Granulated Garlic",
            "1 Teaspoon Red Pepper Flakes",
            "12 Chicken Legs"
        ],
        instructions: [
            "Combine all ingredients to create a marinade.",
            "Marinate chicken legs for 24 hours.",
            "Cook as desired (grilling recommended)."
        ],
        preview: "Fan favorite at our superbowl parties - marinate for 24 hrs for best results."
    },
    {
        title: "Chicken Bacon Ranch Pasta",
        author: "Jeff",
        category: "main",
        ingredients: [
            "2 cups cheddar cheese, shredded",
            "6 strips bacon",
            "Salt/Pepper to taste",
            "1 teaspoon Italian seasoning",
            "2 small boneless skinless chicken breasts",
            "2 cups uncooked pasta (Rotini recommended)",
            "2 tablespoons butter",
            "2 tablespoons flour",
            "1 tablespoon garlic, minced",
            "2 cups half and half",
            "2 tablespoons dry ranch dressing seasoning mix"
        ],
        instructions: [
            "Cook the Bacon: In a large skillet over low heat, cook the bacon until crisp. Set aside, reserve drippings, and roughly chop the bacon once cooled.",
            "Prepare the Chicken: Slice the chicken breasts into thinner pieces, season with salt, pepper, onion powder, and Italian seasoning. Sear in bacon drippings over medium-high heat until golden and cooked through. Cube after resting.",
            "Boil the Pasta: Cook in boiling salted water until al dente. Drain.",
            "Make the Sauce: In the skillet, melt butter and sauté garlic. Add flour, then gradually add half and half. Stir in ranch seasoning and cheese until smooth.",
            "Combine: Add pasta to the sauce, then chicken, and garnish with bacon. Serve warm."
        ],
        preview: "A creamy pasta dish combining chicken, bacon, and ranch flavors."
    },
    {
        title: "Homemade Tomato Soup",
        author: "Bridgette",
        category: "soup",
        ingredients: [
            "4 slicing tomatoes",
            "6 Roma tomatoes",
            "1 onion",
            "1 head of garlic",
            "Olive oil",
            "Salt and pepper"
        ],
        instructions: [
            "Preheat oven to 350°F",
            "On large baking sheet cut 4 slicing and 6 Roma tomatoes in half.",
            "Cut one onion in half and cut a head of garlic in half lightly drizzle with olive oil salt and pepper.",
            "Bake at 350°F for 30 min",
            "Blend to desired consistency then cook over a burner for 20 minutes",
            "This is a wonderful way to enjoy meatless Monday in my household."
        ],
        preview: "A simple classic that so many get from a can - it's too easy to make yourself!"
    },
    {
        title: "Chicken Lombardy",
        author: "Brian",
        category: "main",
        ingredients: [
            "3 boneless skinless chicken breasts",
            "⅓ cup butter, divided",
            "½ cup flour",
            "8 oz sliced mushrooms",
            "¾ cup marsala wine",
            "½ cup chicken stock",
            "½ teaspoon salt",
            "¼ teaspoon pepper",
            "½ cup shredded mozzarella",
            "½ cup parmesan cheese",
            "2 green onions, sliced"
        ],
        instructions: [
            "Heat large skillet over medium-high heat and add 2 tablespoons butter.",
            "Add mushrooms and cook, stirring frequently, until they begin to brown; remove and set aside.",
            "Slice chicken breasts in half lengthwise. Flatten each piece between 2 sheets of waxed paper or plastic wrap with a meat mallet to about ¼-inch thickness.",
            "Dredge each flattened piece in flour.",
            "In the same pan you cooked mushrooms in, add 1 tablespoon butter and heat over medium-high heat.",
            "Add 2 chicken breast pieces and brown well on all sides. Remove and set aside.",
            "Repeat browning process 2 more times (using 1 tablespoon butter with each shift). Don't drain the drippings, you need it for the marsala sauce.",
            "Preheat oven to 450°F. Lightly grease a 13x9-inch baking pan.",
            "Add chicken breasts to prepared baking pan, overlapping each piece slightly. Sprinkle evenly with mushrooms.",
            "Using same pan with collected drippings, add wine, chicken stock, salt and pepper. Bring to a boil, reduce heat and simmer uncovered for 10 minutes.",
            "Pour sauce evenly over chicken.",
            "Mix cheeses and green onions and distribute over top of chicken.",
            "Bake for 15-20 minutes until cheese is melted and just starting to brown.",
            "Serving suggestion: Goes well with pasta.",
            "Note: This recipe freezes well."
        ],
        preview: "A delicious, restaurant-style chicken dish with marsala wine sauce, mushrooms, and melted cheese. A bit fussy but worth the effort!"
    },
    {
        title: "Tzatziki Sauce for Gyros",
        author: "Sean",
        category: "side",
        ingredients: [
            "1/2 Fresh Garlic Chopped (or equivalent minced)",
            "1 Tbsp Salt",
            "1 Tbsp Extra Virgin Olive Oil",
            "1 Tbsp White Vinegar",
            "2.5 cups whole / full fat yogurt (low fat just does not come out at a good consistency)",
            "Chopped fresh dill to taste (I use a whole package, stems removed)",
            "1 grated European cucumber"
        ],
        instructions: [
            "Smash garlic, salt, olive oil, and vinegar together in small dish",
            "Remove seeds from cucumber and grate with skin on. Squeeze out excess water from grated cucumber.",
            "Combine all ingredients."
        ],
        preview: "Traditional Greek tzatziki sauce for gyros, made with yogurt and cucumber."
    },
    {
        title: "Gyros Marinade",
        author: "Sean",
        category: "main",
        ingredients: [
            "7-1/2 pounds of meat (lamb, beef or venison), sliced about 1/4\" thick",
            "Marinade binder:",
            "4 Garlic cloves crushed",
            "2 Tbsp Olive Oil",
            "1-1/2 tsp Salt",
            "Dry rub:",
            "~1/2 tsp salt per pound (4 tsp for 7.5 pounds)",
            "~1/2 tsp pepper per pound (4 tsp for 7.5 pounds)",
            "~1/2 tsp greek oregano per pound (4 tsp for 7.5 pounds)"
        ],
        instructions: [
            "Mix marinade, coat strips of meat with marinade then sprinkle/dip coated slices in dry rub.",
            "Cook meat on charcoal grill.",
            "Serve with fresh chopped onions, tomatoes, lettuce and greek olives."
        ],
        preview: "A flavorful marinade for authentic Greek-style gyros with lamb, beef, or venison."
    },
    {
        title: "Chocolate Cream Pie",
        author: "Philip",
        category: "dessert",
        ingredients: [
            "¾ cup white sugar, divided",
            "⅓ cup all-purpose flour",
            "2 cups milk",
            "2 (1 ounce) squares unsweetened chocolate",
            "3 egg yolks, lightly beaten",
            "2 tablespoons butter",
            "1 teaspoon vanilla extract",
            "1 (9 inch) pie shell, baked"
        ],
        instructions: [
            "Combine 1/2 cup sugar, flour, milk, and chopped chocolate in a 2-quart saucepan. Cook over medium-high heat, stirring constantly, until mixture begins to bubble. Reduce heat; simmer and continue stirring for 2 minutes more.",
            "Remove pan from heat. Whisk remaining 1/4 cup sugar into egg yolks.",
            "Pour the hot milk mixture into the egg yolks in a slow stream, whisking constantly. Return filling mixture to the saucepan and cook over medium heat for an additional 90 seconds, stirring constantly. Remove from heat, and stir in butter and vanilla.",
            "Pour filling into pie shell, and chill until set, about 4 hours. Top with whipped cream and a little grated chocolate before serving."
        ],
        preview: "A rich, chocolate pie for holidays and special occasions."
    },
    {
        title: "Haystacks (No-Bake Chocolate Oatmeal Cookies)",
        author: "JoAnn",
        category: "dessert",
        ingredients: [
            "2 cups white sugar",
            "½ cup butter or margarine",
            "½ cup milk",
            "3 tablespoons unsweetened cocoa powder",
            "1 pinch salt",
            "3 cups quick cooking oats",
            "½ cup peanut butter",
            "1 teaspoon vanilla extract"
        ],
        instructions: [
            "Bring sugar, butter, milk, cocoa, and salt to a full rolling boil in a saucepan for 2 minutes.",
            "Add quick-cooking oats, peanut butter, and vanilla; mix well.",
            "Working quickly, drop by teaspoonfuls onto waxed paper and let cool.",
            "For best results, let the mixture set in the bowl for a few minutes to keep cookies from spreading too much."
        ],
        preview: "Quick and easy no-bake cookies combining chocolate, peanut butter, and oats for a delicious treat with no oven required."
    },
    {
        title: "Pickle Dip",
        author: "Nathan",
        category: "side",
        ingredients: [
            "2 blocks softened cream cheese",
            "6-8 packs Carl Budding Corned Beef",
            "1/2 jar baby dill pickles",
            "1-2 Tbsp pickle juice",
            "Frito Scoops for serving"
        ],
        instructions: [
            "Add pickles and corned beef to blender/food processor and chop finely.",
            "Put softened cream cheese into a bowl, add the pickle/beef mixture, and stir.",
            "Stir in pickle juice to taste, and serve with Frito Scoops."
        ],
        preview: "A creamy, tangy dip combining cream cheese, corned beef and dill pickles - perfect with Frito Scoops for gatherings."
    },
    {
        title: "Uncle Joe's Adobo",
        author: "Eddie",
        category: "main",
        ingredients: [
            "5+ pounds pork butt, cut into 1½\"-2\" cubes",
            "1 whole head of garlic (8-10 cloves), finely minced",
            "3 dozen whole peppercorns",
            "3-4 bay leaves",
            "½ cup vinegar (or ⅓ cup to taste)",
            "6 tablespoons soy sauce",
            "1 teaspoon salt",
            "¼ teaspoon fine ground pepper",
            "2 tablespoons peanut butter",
            "2 teaspoons regular paprika (not smoked)",
            "2½ cups water (adjustable to taste)"
        ],
        instructions: [
            "Fill large pot with garlic, peppercorns, bay leaves, vinegar, soy sauce, salt, pepper, and water.",
            "Add pork and stir.",
            "Boil on high until the meat releases its juices (30-40 minutes).",
            "Transfer meat to a heated large fry pan.",
            "Sprinkle paprika on meat, stir, and brown.",
            "Reduce liquid and add peanut butter.",
            "Strain liquid into fry pan with meat.",
            "Time-saving tip: Brown the meat with paprika at the beginning before adding everything to pot.",
            "Pro tip: Use a seasoning bag for peppercorns and bay leaves to avoid straining."
        ],
        preview: "A Filipino-style pork adobo with a unique twist of peanut butter, passed down from Uncle Joe."
    },
    {
        title: "Sicilian Olive Oil Cake",
        author: "Kim",
        category: "dessert",
        ingredients: [
            "6 large navel oranges, zested",
            "1.5 cups orange juice (from zested oranges, supplemented if needed)",
            "3 cups granulated sugar",
            "3.5 cups AP flour",
            "1.5 teaspoons baking powder",
            "1¾ teaspoons salt",
            "5 large eggs",
            "1.5 cups mild, fruity extra virgin olive oil",
            "1-2 tablespoons vanilla bean paste",
            "Confectioners sugar for dusting"
        ],
        instructions: [
            "Preheat oven to 350°F, position rack in middle. Grease and flour a large nonstick bundt pan (12 cup).",
            "Finely grate orange zest with microplane into medium bowl. Add sugar and rub together until fully integrated and orange-colored. Avoid grating white pith to prevent bitterness.",
            "Juice oranges to get 1.5 cups, supplementing if needed. Set juice aside.",
            "In large bowl, mix together flour, baking soda, and salt.",
            "Beat eggs on medium-high for about 1 minute with handheld mixer.",
            "Add orange-sugar mixture to eggs and beat until thick and pale yellow (about 2.5 minutes) on medium.",
            "Mix in vanilla bean paste until just incorporated.",
            "Switch to low speed, alternate adding dry ingredients and olive oil to create batter.",
            "Slowly drizzle in orange juice on low speed until just combined.",
            "Pour batter into prepared pan. Bake about 75 minutes or until tester comes clean in center-lower part.",
            "If top browns too quickly, cover loosely with foil or reduce temperature to 330°F.",
            "Cool on wire rack for exactly 20 minutes, then flip onto serving plate. Cool at least 3 hours or overnight.",
            "Before serving, dust generously with confectioners sugar, or optionally glaze with orange juice or Grand Marnier mixture."
        ],
        preview: "A moist, fragrant Italian cake featuring fresh orange zest and premium olive oil. Best made a day ahead."
    },
    {
        title: "Anne's Favorite Carrot Cake",
        author: "Anne",
        category: "dessert",
        ingredients: [
            "For the cake:",
            "4 eggs",
            "1½ cups vegetable oil",
            "2 cups sugar",
            "2 cups flour",
            "1 teaspoon baking soda",
            "1 teaspoon salt",
            "1½ teaspoons baking powder",
            "2 teaspoons cinnamon",
            "3 cups grated carrots (about 6 medium to large carrots)",
            "1½ cups coarsely chopped walnuts (or pecans)",
            "½ cup shredded coconut",
            "8 oz can crushed pineapple in its own juice, drained",
            "For the cream cheese frosting:",
            "1 stick (¼ pound) butter, softened",
            "8 oz package cream cheese",
            "1 pound (1 box) powdered sugar",
            "2 teaspoons vanilla",
            "½ cup chopped walnuts (or pecans)"
        ],
        instructions: [
            "For the cake:",
            "Beat eggs, then add oil and mix. Add sugar and mix. Set aside.",
            "Combine dry ingredients, then add to oil mixture.",
            "Add carrots, nuts, coconut, and drained pineapple - mix well using a large spoon.",
            "Pour into three 8-inch round greased and floured cake pans.",
            "Bake at 350°F for 25-30 minutes or until cake tester comes out clean.",
            "Cool completely before frosting.",
            "For the cream cheese frosting:",
            "Cream together butter and cream cheese.",
            "Mix in powdered sugar well.",
            "Add vanilla and nuts.",
            "Beat to desired consistency.",
            "Assemble the cake by frosting between layers and covering the top and sides."
        ],
        preview: "A moist, rich carrot cake loaded with nuts, coconut, and pineapple, topped with classic cream cheese frosting."
    },
    {
        title: "Garlic Parmesan Chicken and Potatoes",
        author: "Rob",
        category: "main",
        ingredients: [
            "2 chicken breasts",
            "4-5 small/medium-sized potatoes",
            "Olive oil",
            "Salt and pepper",
            "Garlic powder",
            "Cajun seasoning",
            "2 tablespoons butter",
            "½ teaspoon salt",
            "½ teaspoon pepper",
            "1 teaspoon paprika",
            "1 teaspoon onion powder",
            "1 teaspoon Italian seasoning",
            "2 tablespoons minced garlic",
            "Buffalo Wild Wings Garlic Parmesan Sauce (about half a bottle)",
            "1 cup shredded mozzarella cheese"
        ],
        instructions: [
            "Preheat air fryer and oven to 400°F.",
            "Peel and dice potatoes into small chunks (about eighths).",
            "In a bowl, toss potatoes with olive oil, salt, pepper, garlic powder, and cajun seasoning to taste.",
            "Transfer seasoned potatoes to air fryer.",
            "While potatoes cook, dice chicken breasts into small chunks.",
            "Heat pan on stove, add butter and garlic.",
            "Add diced chicken and seasonings, cook until done.",
            "Add Buffalo Wild Wings sauce to chicken (about half a bottle, or to taste).",
            "Remember to toss potatoes occasionally in air fryer for even crisping.",
            "Once both chicken and potatoes are done, combine them either in the skillet or a casserole dish.",
            "Optional: toss everything together with additional sauce.",
            "Top with mozzarella cheese.",
            "Bake until cheese melts.",
            "Optional: broil briefly to crisp up the cheese.",
            "Pro tip: Make extra - it's that good!"
        ],
        preview: "A comforting dish combining crispy air-fried potatoes and chicken in garlic parmesan sauce, topped with melted mozzarella."
    },
    {
        title: "Lemon Lush",
        author: "Kerry",
        category: "dessert",
        ingredients: [
            "For the crust:",
            "2 cups all-purpose flour",
            "1 cup butter, softened",
            "1 cup chopped pecans",
            "For the cream cheese filling:",
            "2 (8 ounce) packages cream cheese, softened",
            "2 cups powdered sugar",
            "2 tablespoons lemon juice",
            "For the pudding layer:",
            "2 (3.4 ounce) packages instant lemon pudding",
            "3 cups milk",
            "For the whipped cream:",
            "1½ cups heavy cream",
            "½ cup powdered sugar"
        ],
        instructions: [
            "Preheat oven to 350°F.",
            "For the crust: In a food processor, pulse flour and butter together until a dough forms. Add pecans and mix until combined. (Alternative: use pastry cutter or forks to cut butter into flour, then add pecans)",
            "Press mixture into bottom of a 9x13 baking dish. Bake 20-25 minutes or until lightly golden brown. Let cool.",
            "For the cream cheese layer: Beat cream cheese, powdered sugar, and lemon juice together until smooth. Spread evenly over cooled crust.",
            "For the pudding layer: Mix lemon pudding and milk together, beat 3-5 minutes. Let set in refrigerator if needed. Spread over cream cheese layer.",
            "For the whipped cream: Beat heavy cream and powdered sugar until soft peaks form. Spread over pudding mixture.",
            "Chill dessert until ready to serve."
        ],
        preview: "A layered dessert with pecan shortbread crust, cream cheese, lemon pudding, and fresh whipped cream."
    },
    {
        title: "Kevin's Cooking Companion",
        author: "Kevin",
        category: "drink",
        ingredients: [
            "1 bottle of your preferred beverage"
        ],
        instructions: [
            "Open bottle",
            "Pour over ice or drink neat"
        ],
        preview: "For all of the great food recipes being posted, something to enjoy while making them."
    },
    {
        title: "Best Ever Peanut Butter Bars",
        author: "Phil",
        category: "dessert",
        ingredients: [
            "For the bars:",
            "¾ cup butter, room temperature",
            "½ cup granulated sugar",
            "1 cup light brown sugar",
            "2 large eggs",
            "½ teaspoon vanilla extract",
            "½ cup creamy peanut butter (plus more for topping)",
            "2½ teaspoons baking soda",
            "½ teaspoon salt",
            "1½ cups all-purpose flour",
            "2 cups old-fashioned rolled oats",
            "For the chocolate frosting:",
            "¼ cup butter",
            "1 tablespoon unsweetened cocoa powder",
            "1½ tablespoons milk",
            "1¼ cups powdered sugar",
            "1 teaspoon vanilla extract"
        ],
        instructions: [
            "Preheat oven to 350°F.",
            "In a large mixing bowl, cream together the butter, sugar, and brown sugar.",
            "Add eggs, vanilla, and peanut butter and mix well.",
            "In a separate bowl mix together the dry ingredients.",
            "Add dry ingredients to creamy mixture.",
            "Press firmly into a greased 9x13\" pan.",
            "Bake at 350°F for 17-21 minutes. Do not over-bake! They will look just barely set in the center, and will harden as they cool.",
            "Allow to cool completely.",
            "Once cooled, spread a thin layer of peanut butter over the bars.",
            "For the chocolate frosting:",
            "Add butter to a small skillet over medium heat. Once melted, stir in cocoa.",
            "Remove from heat and add milk, powdered sugar and vanilla.",
            "Whisk until smooth, using electric beaters to get out any lumps, if needed.",
            "Spread chocolate frosting over the top of the bars."
        ],
        preview: "Delicious layered peanut butter bars with chocolate frosting - a perfect combination of sweet and salty."
    }
];