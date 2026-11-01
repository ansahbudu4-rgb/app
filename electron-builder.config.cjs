const portalUrl = process.env.SCHOOLHUB_PORTAL_URL || "https://ansahbudu4-rgb.github.io/app/";
const parsedPortalUrl = new URL(portalUrl);

if (parsedPortalUrl.protocol !== "https:") {
  throw new Error("SCHOOLHUB_PORTAL_URL must use HTTPS.");
}

module.exports = {
  appId: "com.schoolhub.desktop",
  productName: "SchoolHub",
  directories: {
    output: "release"
  },
  files: ["src/**/*", "package.json"],
  extraMetadata: {
    schoolhubPortalUrl: parsedPortalUrl.href
  },
  win: {
    target: [{ target: "nsis", arch: ["x64"] }],
    artifactName: "SchoolHub-Setup-${version}.${ext}"
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true
  }
};