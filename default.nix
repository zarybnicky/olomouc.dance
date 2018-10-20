{ pkgs ? import <nixpkgs> {} }:
let
  filterSite = path: _:
    let baseName = baseNameOf (toString path); in
    baseName != "bootstrap" &&
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
