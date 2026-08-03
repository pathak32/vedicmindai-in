// Serves /.well-known/assetlinks.json via API route to bypass
// Vercel's aggressive static file CDN caching on .well-known/ files.
// Google Play TWA verification requires the file to serve fresh on every request.

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json([
    {
      relation: [
        'delegate_permission/common.handle_all_urls',
        'delegate_permission/common.get_login_creds',
      ],
      target: {
        namespace: 'android_app',
        package_name: 'in.vedicmindai.app',
        sha256_cert_fingerprints: [
          'A7:23:A4:BF:87:71:0E:DC:2C:54:FB:DA:11:5F:84:80:DC:AE:9C:6D:E6:FE:FF:C8:FE:6E:5C:61:A0:21:62:E6',
          '3C:84:59:7C:60:E4:C2:04:C9:32:26:31:33:1B:5F:FC:F3:54:6E:E1:CD:6F:C1:63:50:58:6E:6D:0D:22:D5:24',
          '2C:54:62:6A:71:EB:7D:58:C0:F0:37:E0:A8:FE:72:46:E2:C0:51:39:C7:8B:41:4D:7A:D3:B3:5A:F8:57:B7:23',
          '9D:B6:E8:85:74:6D:32:6B:25:41:85:02:9A:77:7C:07:D2:E4:94:E2:53:EC:B4:E2:C9:93:E8:47:11:42:DF:4E',
        ],
      },
    },
  ]);
};
