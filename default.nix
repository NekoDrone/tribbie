# stolen from https://github.com/tgirlcloud/nix-templates/blob/main/node/default.nix
{ lib, buildNpmPackage }:

buildNpmPackage {
  pname = "tribbie";
  version = "0.1.0";

  src = ./.;

  npmDepsHash = lib.fakeHash;

  meta = {
    description = "atproto lexicon to bruno/insomnia/postman collection generator";
    homepage = "https://github.com/NekoDrone/tribbie";
    license = lib.licenses.mit;
    maintainers = with lib.maintainers; [ ];
    mainProgram = "example";
  };
}
