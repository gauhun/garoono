// Renders what the site shows of a doc, from its final PDF:
//   cover.jpg, cover-sm.jpg   page 1 at 600px and 64px
//   1.jpg … N.jpg              every page of a free doc, the first 30% of a paid one
//   next.jpg                   paid only: a 48px copy of the first locked page, blurred behind the offer
// Refuses a PDF that still has an "EDIT ME" draft note. With --allow-notes a paid doc may keep
// notes on pages only buyers get; a note on any page the public sees is always refused.
// Usage: swift scripts/render-doc.swift <file.pdf> <out dir> <free|paid> [--allow-notes]
// Prints {"pages":N,"shown":M,"notes":[…]} for scripts/add-doc.mjs.
import AppKit
import PDFKit

func fail(_ message: String, _ code: Int32) -> Never {
  FileHandle.standardError.write("\(message)\n".data(using: .utf8)!)
  exit(code)
}

let args = CommandLine.arguments
guard args.count >= 4, ["free", "paid"].contains(args[3]) else {
  fail("Usage: swift render-doc.swift <file.pdf> <out dir> <free|paid> [--allow-notes]", 1)
}
guard let doc = PDFDocument(url: URL(fileURLWithPath: args[1])), doc.pageCount > 0 else {
  fail("Can't read \(args[1])", 1)
}
let free = args[3] == "free"
let outDir = URL(fileURLWithPath: args[2], isDirectory: true)
try FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

let pages = doc.pageCount
// At least one page shown, and a paid doc always keeps at least one page back
let shown = free ? pages : max(1, min(pages - 1, Int((Double(pages) * 0.3).rounded(.up))))

let notes = (0..<pages)
  .filter { (doc.page(at: $0)?.string ?? "").range(of: "EDIT ME", options: .caseInsensitive) != nil }
  .map { $0 + 1 }
if notes.contains(where: { $0 <= shown }) || (!notes.isEmpty && !args.contains("--allow-notes")) {
  fail("EDIT ME note on page \(notes.map(String.init).joined(separator: ", ")). Fix it in Google Docs and export again.", 2)
}

func render(_ index: Int, width: CGFloat, quality: Double, to name: String) throws {
  guard let page = doc.page(at: index) else { return }
  let box = page.bounds(for: .cropBox)
  let size = NSSize(width: width, height: (box.height * width / box.width).rounded())
  let image = page.thumbnail(of: size, for: .cropBox)
  guard let tiff = image.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
        let jpg = rep.representation(using: .jpeg, properties: [.compressionFactor: quality]) else {
    throw NSError(domain: "render", code: 1)
  }
  try jpg.write(to: outDir.appendingPathComponent(name))
}

try render(0, width: 600, quality: 0.85, to: "cover.jpg")
try render(0, width: 64, quality: 0.85, to: "cover-sm.jpg")
for i in 0..<shown {
  try render(i, width: 1000, quality: 0.8, to: "\(i + 1).jpg")
}
if !free {
  try render(shown, width: 48, quality: 0.6, to: "next.jpg")
}

print("{\"pages\":\(pages),\"shown\":\(shown),\"notes\":[\(notes.map(String.init).joined(separator: ","))]}")
