# [Tribbie](https://honkai-star-rail.fandom.com/wiki/Tribbie) ([Tribios](https://honkai-star-rail.fandom.com/wiki/Tribios))

Tribbie is a tool that creates [Bruno](https://www.usebruno.com/)/[Insomnia](https://insomnia.rest/)/[Postman](https://www.postman.com/web) collections based on a (set of) given [ATProto](https://atproto.com/) [lexicons](https://atproto.com/specs/lexicon)

## Usage

TBD. I don't think I'm gonna bother shipping a binary, you might just wanna do dev steps unless I bother rewriting this in Go or even Rust.

## Development

Requirements

- nodejs

Steps:

1. Clone this repository `git clone https://github.com/NekoDrone/tribbie`
2. Enter the folder `cd tribbie` and install dependencies `pnpm install`
3. Under `src/targets.ts`, provide the link to each lexicon you want to generate
4. Run `pnpm tribbie/generate` to run the generation scripts (this can take a while!)
5. Import the resulting config into your API testing tool of choice

```bash
git clone https://github.com/NekoDrone/tribbie
cd tribbie
pnpm install
pnpm tribbie/generate
```

If you are a nix user (based, also get help), there is a provided dev flake which is available upon `nix develop`.

## Contributions

PRs and issues always welcome :)
