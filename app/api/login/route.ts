export function GET() {
    return Response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=gist`);
}