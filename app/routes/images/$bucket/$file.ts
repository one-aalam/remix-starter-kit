import { LoaderFunction } from "@remix-run/server-runtime";
import {  supabase } from '../../../lib/supabase/supabase.server'

export let loader: LoaderFunction = async ({ params }) => {
    // download the image from Supa bucket
    // @TODO: Make it more robust
    const { data: blob, error: downloadError } = await supabase.storage.from(params.bucket || 'provide_ur_default_bucket_here').download(params.file || 'default_img.jpg')
    // convert to ArrayBuffer
    const blobArrayBuffer  = await blob?.arrayBuffer()
    // Send it!
    return new Response(blobArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": blob?.type!,
        "Content-Length": `${blob?.size}`
      }
    });
  }
