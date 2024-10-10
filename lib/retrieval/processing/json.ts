import { FileItemChunk } from "@/types";
import { encode } from "gpt-tokenizer";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CHUNK_OVERLAP, CHUNK_SIZE } from ".";

export const processJSON = async (json: Blob): Promise<FileItemChunk[]> => {
  const loader = new JSONLoader(json);
  const docs = await loader.load();
  const completeText = docs.map((doc) => doc.pageContent).join(" "); // Usar const

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });
  const splitDocs = await splitter.createDocuments([completeText]);

  const chunks: FileItemChunk[] = []; // Usar const

  for (let i = 0; i < splitDocs.length; i++) {
    const doc = splitDocs[i];

    chunks.push({
      content: doc.pageContent,
      tokens: encode(doc.pageContent).length,
    });
  }

  return chunks;
};
