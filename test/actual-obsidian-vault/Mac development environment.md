# Mac development environment

## PDFium
We are using PDFium for PDF conversion. This is done by wrapping pdfium-cli in a Node module.

[GitHub - klippa-app/go-pdfium: Easy to use PDF library using Go and PDFium](https://github.com/klippa-app/go-pdfium)

### libjpeg-turbo
To get the most performance out of pdfium-cli we need to build this with a cpecial version of go-pdfium which uses libjpeg-turbo.

- [ ] Get binaries from here: [libjpeg-turbo | Documentation / Official Binaries](https://libjpeg-turbo.org/Documentation/OfficialBinaries)

- [ ] Installed om Mickes Macbook. Uninstall vy running `/opt/libjpeg-turbo/bin/uninstall`

- [ ] Use build tag `pdfium_use_turbojpeg`  to make use of libjpeg-turbo.