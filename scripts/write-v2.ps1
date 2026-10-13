param([Parameter(Mandatory=$true)][string]$FilesJson)
$ErrorActionPreference = 'Stop'
$approvedRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$expectedRoot = 'C:\Users\brand\OneDrive\Desktop\Proyectos trabajo\Proyectos paginas wb\Ingenix-hub\next-app'
if ($approvedRoot -ne $expectedRoot) { throw 'Unexpected V2 root' }
$files = ConvertFrom-Json -InputObject $FilesJson -AsHashtable
foreach ($entry in $files.GetEnumerator()) {
  $target = [System.IO.Path]::GetFullPath((Join-Path $approvedRoot $entry.Key))
  if (-not $target.StartsWith($approvedRoot + '\', [System.StringComparison]::OrdinalIgnoreCase)) { throw 'Outside-V2 write rejected' }
  [System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($target)) | Out-Null
  [System.IO.File]::WriteAllText($target, [string]$entry.Value + [Environment]::NewLine, [System.Text.UTF8Encoding]::new($false))
  Write-Output $entry.Key
}

