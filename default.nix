{ pkgs ? import ./nix {} }:
let
  filterSite = path: _:
    let baseName = baseNameOf (toString path); in
    baseName != "nix" &&
    baseName != "scss" &&
    baseName != "default.nix" &&
    baseName != "result" &&
    baseName != ".git" &&
    baseName != ".gitignore" &&
    baseName != ".gitmodules" &&
    baseName != ".sass-cache";
in pkgs.stdenv.mkDerivation rec {
  name = "olomouc.dance";
  src = builtins.filterSource filterSite ./.;
  phases = "unpackPhase buildPhase";
  buildPhase = ''
    mkdir -p $out
    cp -r ./* $out
  '';
}
