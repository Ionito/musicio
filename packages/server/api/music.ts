import * as util from "util";
import * as fs from "fs";

import fetch from "node-fetch";
import * as mm from "music-metadata";

import {Song} from "../types";

const TOTAL_SONGS = 310;

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
    "'": "",
  };
  return cadena
    .split("")
    .map((letra) => acentos[letra] || letra)
    .join("")
    .toString();
};

const matches = (query: string, match: string) => {
  const _query = quitarAcentosYApostrofes(query.replace(/\'|\s/g, "").toLowerCase());
  const _match = quitarAcentosYApostrofes(match.replace(/\'|\s/g, "").toLowerCase());

  return _query === _match;
};

const getMetadata = async (url: string) => {
  return new Promise((resolve, reject) => {
    const tempFile = generateString(8);
    downloadFile(url, `./test-${tempFile}.mp3`)
      .then(() => {
        mm.parseFile(`./test-${tempFile}.mp3`)
          .then((metadata) => {
            //console.log(util.inspect(metadata, {showHidden: false, depth: null}));
            fs.unlinkSync(`./test-${tempFile}.mp3`);
            resolve(metadata.common);
            // meta["title"] = metadata.common.title;
          })
          .catch((err) => {
            reject(err.message);
          });
      })
      .catch((err) => resolve(err));
  });
};

const random = async () => {
  const match = Math.round(Math.random() * (TOTAL_SONGS - 1)) + 1;
  const url = `https://1986158210.rsc.cdn77.org/${match}.mp3`;

  const metadata: any = await getMetadata(url);

  console.log(metadata);

  let res: Song = {
    title: metadata?.title,
    author: metadata?.artist,
    year: metadata?.year,
    source: url,
  };

  console.log("res", res);

  return res;
};

export default {
  matches,
  random,
};