-- ingredients
create table ingredients (
    id text primary key default gen_random_uuid(),
    name text not null,
    category_id text
);

create index ingredients_category_id_idx on ingredients (category_id);

-- categories
create table categories (
    id text primary key default gen_random_uuid(),
    name text not null,
    display_order integer
);

-- recipes
create table recipes (
    id text primary key default gen_random_uuid(),
    name text not null,
    url text,
    tags text,
    prepare_time_in_minutes integer,
    cook_time_in_minutes integer,
    original_text text,
    instructions text,
    modifications text,
    nutrition_facts text
);

create table recipe_ingredients (
    recipe_id text,
    ingredient_id text,
    amount text,
    unit text
);

create index recipe_ingredients_recipe_id_idx on recipe_ingredients (recipe_id);
create index recipe_ingredients_ingredient_id_idx on recipe_ingredients (ingredient_id);

-- grocery_lists
create table grocery_lists (
    id text primary key default gen_random_uuid(),
    week_start date,
    created_at timestamp default current_timestamp
);

create index grocery_lists_week_start_idx on grocery_lists (week_start);

create table grocery_list_recipes (
    grocery_list_id text,
    recipe_id text,
    day_of_week integer,
    scheduled_for date
);

create index grocery_list_recipes_grocery_list_id_idx on grocery_list_recipes (grocery_list_id);
create index grocery_list_recipes_recipe_id_idx on grocery_list_recipes (recipe_id);

create table grocery_list_ingredients (
    grocery_list_id text,
    ingredient_id text,
    amount text,
    unit text
);

create index grocery_list_ingredients_grocery_list_id_idx on grocery_list_ingredients (grocery_list_id);
