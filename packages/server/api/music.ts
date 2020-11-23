import * as fs from "fs";

import fetch from "node-fetch";
import * as mm from "music-metadata";
import levenshtein from "js-levenshtein";

import {Song} from "../types";

import baseSongs from "./songs";

const TOTAL_SONGS = 380;

const generateString = (length: number) =>
  Array(length)
    .fill("")
    .map((v) => Math.random().toString(36).charAt(2))
    .join("");

const downloadFile = async (url: string, path: string) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", (err) => {
      reject(err);
    });
    fileStream.on("finish", function () {
      resolve();
    });
  });
};

interface Ihash {
  [details: string]: string;
}

const quitarAcentosYApostrofes = (cadena: string) => {
  const acentos: Ihash = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
  };
  return cadena
    .split("")
    .map((letra) => acentos[letra] || letra)
    .join("")
    .toString();
};

const matches = (query: string, match: string) => {
  const _query = quitarAcentosYApostrofes(query.replace(/\'|\s|\./g, "").toLowerCase());
  const _match = quitarAcentosYApostrofes(match.replace(/\'|\s|\./g, "").toLowerCase());

  return _query === _match || levenshtein(_query, _match) <= 2;
};

const getMetadata = async (url: string) => {
  return new Promise((resolve, reject) => {
    const tempFile = generateString(8);
    downloadFile(url, `./test-${tempFile}.mp3`)
      .then(() => {
        mm.parseFile(`./test-${tempFile}.mp3`)
          .then((metadata) => {
            fs.unlinkSync(`./test-${tempFile}.mp3`);
            resolve(metadata.common);
          })
          .catch((err) => {
            reject(err.message);
          });
      })
      .catch((err) => resolve(err));
  });
};

const random = async (playedArray: number[]) => {
  let match;
  do {
    match = Math.round(Math.random() * TOTAL_SONGS) + 1;
  } while (playedArray.includes(match));

  const url = `https://storage.googleapis.com/fiestita15/${match}.mp3`;

  const metadata = baseSongs[match - 1];
  // const metadata: any = await getMetadata(url);

  let res: Song = {
    id: match,
    title: metadata?.title,
    author: metadata?.artist || "autor desconocido",
    year: metadata?.year || 0,
    source: url,
  };
  console.log(res);
  return res;
};

export default {
  matches,
  random,
};
