-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Wishlists table
create table wishlists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Wishlist items table
create table wishlist_items (
  id uuid default uuid_generate_v4() primary key,
  wishlist_id uuid references wishlists(id) on delete cascade not null,
  name text not null,
  description text,
  image_url text,
  purchase_url text,
  price decimal(10,2),
  priority smallint default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reservations table
create table reservations (
  id uuid default uuid_generate_v4() primary key,
  item_id uuid references wishlist_items(id) on delete cascade not null,
  reserver_email text,
  reserver_name text,
  reserved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text check (status in ('reserved', 'purchased', 'cancelled')) default 'reserved'
);

-- Row Level Security (RLS) Policies
alter table profiles enable row level security;
alter table wishlists enable row level security;
alter table wishlist_items enable row level security;
alter table reservations enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Wishlists policies
create policy "Public wishlists are viewable by everyone"
  on wishlists for select
  using ( is_public = true or auth.uid() = user_id );

create policy "Users can create their own wishlists"
  on wishlists for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own wishlists"
  on wishlists for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own wishlists"
  on wishlists for delete
  using ( auth.uid() = user_id );

-- Wishlist items policies
create policy "Wishlist items are viewable by wishlist viewers"
  on wishlist_items for select
  using (
    exists (
      select 1 from wishlists
      where id = wishlist_items.wishlist_id
      and (is_public = true or user_id = auth.uid())
    )
  );

create policy "Users can create items in their wishlists"
  on wishlist_items for insert
  with check (
    exists (
      select 1 from wishlists
      where id = wishlist_items.wishlist_id
      and user_id = auth.uid()
    )
  );

create policy "Users can update items in their wishlists"
  on wishlist_items for update
  using (
    exists (
      select 1 from wishlists
      where id = wishlist_items.wishlist_id
      and user_id = auth.uid()
    )
  );

create policy "Users can delete items in their wishlists"
  on wishlist_items for delete
  using (
    exists (
      select 1 from wishlists
      where id = wishlist_items.wishlist_id
      and user_id = auth.uid()
    )
  );

-- Reservations policies
create policy "Reservations are viewable by wishlist owners"
  on reservations for select
  using (
    exists (
      select 1 from wishlist_items
      join wishlists on wishlists.id = wishlist_items.wishlist_id
      where wishlist_items.id = reservations.item_id
      and wishlists.user_id = auth.uid()
    )
  );

create policy "Anyone can create reservations"
  on reservations for insert
  with check ( true );

-- Functions and Triggers
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 