/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

"use strict";

const dummyToken = String(Math.random()).substr(2);

let files = {};

export async function authorize()
{
  return dummyToken;
}

export async function get(path, token)
{
  if (token != dummyToken)
    throw "sync_invalid_token";

  if (!path.startsWith("/"))
    throw "sync_invalid_path";

  let result = null;
  if (files.hasOwnProperty(path))
    result = Object.assign({}, files[path]);
  if (result && provider.changeRevisionOnGet > 0)
  {
    files[path].revision++;
    provider.changeRevisionOnGet--;
  }
  return result;
}

export async function put(path, contents, replaceRevision, token)
{
  if (token != dummyToken)
    throw "sync_invalid_token";

  if (!path.startsWith("/"))
    throw "sync_invalid_path";

  let currentRevision = files.hasOwnProperty(path) ? files[path].revision : null;
  if (currentRevision !== replaceRevision)
    throw "sync_wrong_revision";

  let revision = currentRevision ? String(parseInt(currentRevision, 10) + 1) : "1";
  files[path] = {revision, contents};
}

let provider = {
  changeRevisionOnGet: 0,
  _get(path)
  {
    return files[path];
  },
  _set(path, revision, contents)
  {
    files[path] = {revision, contents};
  },
  _reset()
  {
    files = {};
    provider.changeRevisionOnGet = 0;
  },
  authorize,
  get,
  put
};

export default provider;
