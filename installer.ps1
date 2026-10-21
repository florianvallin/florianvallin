$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.Application]::EnableVisualStyles()
$payload = Join-Path $PSScriptRoot 'correctif'
$manifest = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'verification.json') -Raw -Encoding UTF8 | ConvertFrom-Json
function ChildPath([string]$parent, [string]$relative) {
    $base = [IO.Path]::GetFullPath($parent).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
    $child = [IO.Path]::GetFullPath((Join-Path $base ($relative.Replace('/', '\'))))
    if (-not $child.StartsWith($base, [StringComparison]::OrdinalIgnoreCase)) { throw 'Chemin de fichier invalide dans le correctif.' }
    return $child
}
# Vérifier toute l'archive avant de toucher au site.
foreach ($entry in $manifest) {
    $source = ChildPath $payload $entry.path
    if (-not (Test-Path -LiteralPath $source -PathType Leaf)) { throw "Fichier absent : $($entry.path). Décompressez toute l'archive avant de lancer INSTALLER.cmd." }
    if ((Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash -ne $entry.sha256) { throw "Fichier incomplet : $($entry.path). Décompressez à nouveau le correctif." }
}
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = 'Choisissez le dossier DU SITE ouvert dans VSCode : il doit contenir index.html, js et blog.'
$dialog.ShowNewFolderButton = $false
if ($dialog.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) { Write-Host 'Installation annulée. Aucun fichier modifié.'; exit 0 }
$target = [IO.Path]::GetFullPath($dialog.SelectedPath)
if (-not (Test-Path -LiteralPath (Join-Path $target 'index.html') -PathType Leaf) -or -not (Test-Path -LiteralPath (Join-Path $target 'js') -PathType Container) -or -not (Test-Path -LiteralPath (Join-Path $target 'blog') -PathType Container)) {
    throw 'Ce dossier ne semble pas être la racine du site. Choisissez celui qui contient index.html, js et blog.'
}
$backup = Join-Path (Split-Path $target -Parent) ('philosophal-sauvegarde-' + [DateTime]::Now.ToString('yyyyMMdd-HHmmss-fff'))
$updated = New-Object System.Collections.ArrayList
try {
    # La sauvegarde reste à côté du site, hors des fichiers à publier.
    foreach ($entry in $manifest) {
        $destination = ChildPath $target $entry.path
        if (Test-Path -LiteralPath $destination -PathType Leaf) {
            $saved = ChildPath $backup $entry.path
            New-Item -ItemType Directory -Path (Split-Path $saved -Parent) -Force | Out-Null
            Copy-Item -LiteralPath $destination -Destination $saved -Force
        }
    }
    foreach ($entry in $manifest) {
        $destination = ChildPath $target $entry.path
        New-Item -ItemType Directory -Path (Split-Path $destination -Parent) -Force | Out-Null
        [void]$updated.Add([PSCustomObject]@{ path = $entry.path; existed = (Test-Path -LiteralPath $destination -PathType Leaf) })
        Copy-Item -LiteralPath (ChildPath $payload $entry.path) -Destination $destination -Force
        if ((Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash -ne $entry.sha256) { throw "Vérification échouée : $($entry.path)" }
    }
    $blog = Get-Content -LiteralPath (Join-Path $target 'blog/index.html') -Raw -Encoding UTF8
    $prompt = Get-Content -LiteralPath (Join-Path $target 'apprendre/creation/teleprompteur/index.html') -Raw -Encoding UTF8
    if (-not $blog.Contains('data-blog-card') -or -not $prompt.Contains('data-script')) { throw 'Le contenu des pages principales ne correspond pas au correctif.' }
} catch {
    $originalError = $_
    foreach ($entry in $updated) {
        $destination = ChildPath $target $entry.path
        if ($entry.existed) { Copy-Item -LiteralPath (ChildPath $backup $entry.path) -Destination $destination -Force }
        elseif (Test-Path -LiteralPath $destination -PathType Leaf) { Remove-Item -LiteralPath $destination -Force }
    }
    throw "Installation interrompue, fichiers précédents restaurés. $originalError"
}
Write-Host ''
Write-Host 'INSTALLATION TERMINEE ET FICHIERS VERIFIES.' -ForegroundColor Green
Write-Host "Site : $target"
Write-Host "Sauvegarde : $backup"
Write-Host 'Ouvrez ce dossier dans VSCode, relancez Live Server, puis Ctrl + F5.'
Write-Host 'Blog : /blog/ ; teleprompteur : /apprendre/creation/teleprompteur/ ; lecteur : /epub/'
Write-Host 'Pour publier, utilisez votre dossier de site habituel, pas le dossier du correctif.'
