const test = require("tape");
const Excel = require("exceljs");

const extract = function (mapping) {
  const set = new Set();
  const dig = function (a) {
    if (Array.isArray(a)) {
      a.forEach((b) => dig(b));
      return;
    }
    if (typeof a === "object") {
      for (const k of Object.keys(a)) if (k.includes("/")) set.add(k.substring(k.indexOf("/") + 1));
      for (const v of Object.values(a)) dig(v);
    }
    if (typeof a === "string" && a.startsWith("/")) set.add(a.substring(1));
  };
  dig(mapping);
  return set;
};

const sheetnames = {
  個人: "Person",
  法人: "LegalEntity",
  事業所: "BusinessPlace",
  連絡先: "ContactPoint",
  住所: "Address",
  施設: "Facility",
  アクセシビリティ: "Accessibility",
  子供預かり情報: "ChildcareInformation",
  土地: "Land",
  建物: "Building",
  設備: "Equipment",
  イベント: "Event",
  ID情報型: "IdInformationModel",
  コード情報型: "CodeInformationModel",
  役割関与情報型: "RoleInformationModel",
  関連組織情報型: "RelatedOrganizationInformationModel",
};

test("test with excel", async function (t) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(`${__dirname}/CoredatamodelVocabulary_Draft_20250325.xlsx`);

  for (const worksheet of workbook.worksheets) {
    t.comment(`testing ${worksheet.name}`);
    const clazz = sheetnames[worksheet.name];
    if (clazz === undefined) {
      t.comment(`skip  ${worksheet.name}`);
      continue;
    }

    const gif = new Set();
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell({ includeEmpty: false }, (cell) => {
        const key = cell.address;
        const val = cell.value;
        if (key.match(/^F[0-9]+$/) && val.match(/^[a-zA-Z_]+$/)) {
          if (gif.has(val)) console.error("GIF duplicate ", worksheet.name, key, val);
          else gif.add(val);
        }
      });
    });

    const map = extract(require(`../mapping/${clazz}.json`));
    t.equal(map.size, gif.size, `${clazz} : Excel と mapping で使用される GIF 項目名数が一致`);
    if (map.size !== gif.size) {
      for (const key of gif) if (!map.has(key)) t.comment(`GIF 項目名 ${key} が未使用`);
      for (const key of map) if (!gif.has(key)) t.comment(`マッピングの ${key} は未定義`);
    }
    for (const key of gif) t.ok(map.has(key), `${clazz} : GIF 項目名 ${key} がマッピングに登場`);
  }

  t.end();
});
