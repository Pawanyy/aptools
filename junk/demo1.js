import Jimp from "jimp";
import fs from "fs";
import QrCode from "qrcode-reader";

const base64QRString =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAV4AAAFeAQAAAADlUEq3AAADEklEQVR4Xu2ZPXbCMBCE5UdByRE4io5mH42j+AgpKXhsdmYlssbCL6kzW+BI+kQx7K9T7Pf2KO87ByY4m+BsgrMJzvY/4Geh+eJit7mc7pc1VmtdfMXDk+AhjL9s8TsOx/6tPEnN/rh0RPAA9v26mN3L9Tb7w3VuFHSG6oIP4Wc5G44hty2TUee4KvgYtsf5y48nM38Uh9sdwUewf3h0n+CijG53UV6l3146IngPF9oTgVxxZ/vgoeAh3O1xtrVahLVfdU+t6VRwTadZZ29aIjFODyxh6Gs8W355oZkED2H/LFczwGvcWQv3sWLSTNEteAOjbkQOpIuCMgjs4lNnMoIHMHKge6P1YaOXYwjsBhcV/AF2p/Rhg01LxV4UYHbT8E3+BoI/wHDD6cHE+NLZEOS0aj/RLTjDRm/sORCGJtC6ztELCh7Cr/crXloWSooCHCvmR2ZLwXs4ArmEp0JSuGh8Q/wM7SF4D0e/hzi+drm9ryl428JHtc2cIjjlOpRcsFDW++f2dgC+2YKckOAdzAiGpGicsc+rUNYdFr214M9wQQ7kPlJhQSdDT41Oxt6iW/ALNjrl3GaOKRJjrJYSxjuCdzAC+cruD1YiyBnWKM53fBFPBA9hj25mxLpA5/BNJEZ4qp9tdRbcYZf0VUzQRrtvOsBsGfmxBbngHRzdH8M6PBU1Bd+wUme4qOCPMJT9eaUMuemiTjHWZ4MJ3sPxhqrNaeGwMwUOnbcuKjjB/gmL6PblnS9WKP6MqozID0zwG8ySC0m5X6KK9DRJm3kmeAh3qmIvUiHu4DiGN8GfYD+2NnpwVeCpV/wzjZ66TQWCM2xeh9G7VAxvUB350e9gogu5BQ/gZrGfXhn07m+js+CN15EqlPtWCLvcMYG0qkwTvIchIloYtn3hoq7snVV5p7PgDYz9JSYQjB64ilh3nfkbcAoWfASzDqONbsfhm5joBjoLzvDZQmA8nnnuXXBJ8AjGn4TXGHgNwwZqNJtqii94CCOCo6asLZApMDbjTtZZcIJ/a4KzCc4mOJvgbIKz/Q3+BudazcdRcmsQAAAAAElFTkSuQmCC"; // Replace this with your Base64 image string

const binaryData = Buffer.from(base64QRString.split(",")[1], "base64");

// Parse the image
Jimp.read(binaryData, function (err, image) {
  if (err) {
    console.error(err);
  }
  let qrcode = new QrCode();
  qrcode.callback = function (err, value) {
    if (err) {
      console.error(err);
    }
    console.log(value.result);
  };
  qrcode.decode(image.bitmap);
});
