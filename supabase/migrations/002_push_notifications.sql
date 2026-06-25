-- Add push notification fields to profiles
alter table profiles add column if not exists push_endpoint text;
alter table profiles add column if not exists push_p256dh text;
alter table profiles add column if not exists push_auth text;
alter table profiles add column if not exists notify_push boolean default true;
alter table profiles add column if not exists notify_email boolean default true;
