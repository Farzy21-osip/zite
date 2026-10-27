/** @type {import('next').NextConfig} */
// The experimental caching flags that create-next-app turns on are left off: they made the dev server
// show stale pages after content was saved in /admin, and this site does not need them.
const nextConfig = {
  // The Learning Journey page became a section of Papers.
  async redirects() {
    return [{ source: "/learning", destination: "/papers#learning-journey", permanent: false }];
  },
};

export default nextConfig;
