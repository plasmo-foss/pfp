/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

"use strict";

const dummyToken = String(Math.random()).substr(2);

let files = {};

exports._get = function(path)
{
  return files[path];
};

exports._set = function(path, revision, contents)
{
  files[path] = {revision, contents};
};

exports._reset = function()
{
  files = {};
};

exports.authorize = function()
{
  return Promise.resolve(dummyToken);
};

exports.get = function(path, token)
{
  if (token != dummyToken)
    return Promise.reject("unauthorized");

  if (!path.startsWith("/"))
    return Promise.reject("invalid-path");

  return Promise.resolve(files.hasOwnProperty(path) ? files[path] : null);
};

exports.put = function(path, contents, replaceRevision, token)
{
  if (token != dummyToken)
    return Promise.reject("unauthorized");

  if (!path.startsWith("/"))
    return Promise.reject("invalid-path");

  let currentRevision = files.hasOwnProperty(path) ? files[path].revision : null;
  if (currentRevision !== replaceRevision)
    return Promise.reject("wrong-revision");

  let revision = currentRevision ? String(parseInt(currentRevision, 10) + 1) : "1";
  return Promise.resolve().then(() =>
  {
    files[path] = {revision, contents};
  });
};
