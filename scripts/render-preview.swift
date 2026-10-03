// Renders the free preview of a paid doc: the first 30% of its pages as JPEGs, plus
// a tiny copy of the next page that the reader blurs behind the unlock card.
// Usage: swift scripts/render-preview.swift <file.pdf> <out dir>
// Prints {"pages":N,"shown":M} for scripts/doc-previews.mjs.
import AppKit
import PDFKit

let args = CommandLine.arguments
guard args.count == 3, let doc = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
  FileHandle.standardError.write("Usage: swift render-preview.swift <file.pdf> <out dir>\n".data(using: .utf8)!)
  exit(1)
}
let outDir = URL(fileURLWithPath: args[2], isDirectory: true)
try FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

let pages = doc.pageCount
// At least one page shown and at least one page kept back
let shown = max(1, min(pages - 1, Int((Double(pages) * 0.3).rounded(.up))))

func render(_ index: Int, width: CGFloat, quality: Double, to name: String) throws {
  guard let page = doc.page(at: index) else { return }
  let box = page.bounds(for: .cropBox)
  let scale = width / box.width
  let size = NSSize(width: width, height: (box.height * scale).rounded())
  let image = page.thumbnail(of: size, for: .cropBox)
  guard let tiff = image.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
        let jpg = rep.representation(using: .jpeg, properties: [.compressionFactor: quality]) else {
    throw NSError(domain: "render", code: 1)
  }
  try jpg.write(to: outDir.appendingPathComponent(name))
}

for i in 0..<shown {
  try render(i, width: 1000, quality: 0.72, to: "\(i + 1).jpg")
}
if shown < pages {
  try render(shown, width: 48, quality: 0.6, to: "next.jpg")
}

print("{\"pages\":\(pages),\"shown\":\(shown)}")
