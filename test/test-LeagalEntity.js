const test = require("tape");
const jx = require("@indigo-lab/jx");

const base = `${__dirname}/../mapping/`;
const mapping = require("../mapping/LegalEntity.json");

test("test LeagalEntity with jx", function (t) {
  const gif = {
    legalEntityNumber: "4000012090001",
    tradeName: "経済産業省",
    tradeNameKana: "ケイザイサンギョウショウ",
    tradeNameEn: "Ministry of Economy, Trade and Industry",
    categoryOfOrganization: "101",
    contactPointInformation: {
      contactPointUrl:
        "https://www.houjin-bangou.nta.go.jp/henkorireki-johoto.html?selHouzinNo=4000012090001",
    },
    registeredAddress_MP04: {
      localGovernmentCode: "131016",
      prefecture: "東京都",
      cityAndCounty: "千代田区",
      streetAddressAndCityBlock: "霞が関１丁目３－１",
      fullAddress: "東京都千代田区霞が関１丁目３－１",
      postalCode: "1000013",
      prefectureEn: "Tokyo",
      cityAndCountyEn: "1-3-1, Kasumigaseki, Chiyoda ku",
      fullAddressEn: "1-3-1, Kasumigaseki, Chiyoda ku, Tokyo",
      buildingNameEtc: "",
    },
  };
  const imi = {
    "@context": "https://imi.go.jp/ns/core/context.jsonld",
    "@type": "法人型",
    ID: {
      "@type": "ID型",
      体系: {
        "@type": "ID体系型",
        種別: "法人番号",
      },
      識別値: "4000012090001",
    },
    名称: {
      "@type": "名称型",
      種別: "商号または名称",
      表記: "経済産業省",
      カナ表記: "ケイザイサンギョウショウ",
      ローマ字表記: "Ministry of Economy, Trade and Industry",
    },
    組織種別: {
      "@type": "コード型",
      コード種別: {
        "@type": "コードリスト型",
        種別: "法人種別コード",
      },
      識別値: "101",
    },
    連絡先: {
      "@context": "https://imi.go.jp/ns/core/context.jsonld",
      "@type": "連絡先型",
      Webサイト:
        "https://www.houjin-bangou.nta.go.jp/henkorireki-johoto.html?selHouzinNo=4000012090001",
    },
  };

  t.deepEqual(jx(mapping, gif, base), imi, "LegalEntity 1");
  t.end();
});
