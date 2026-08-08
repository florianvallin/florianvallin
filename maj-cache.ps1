# Mise à jour automatique du cache — florianvallin.fr
# À placer à la racine du site, puis clic droit > "Exécuter avec PowerShell"
# ou dans PowerShell : .\maj-cache.ps1
#
# Le script change le paramètre ?v= de toutes les ressources locales
# (CSS, JS, images, polices) dans les fichiers HTML/CSS.
# Ainsi, après chaque publication, le navigateur voit de nouvelles URL
# et recharge réellement les fichiers modifiés.

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Version = Get-Date -Format "yyyyMMddHHmmss"

Write-Host ""
Write-Host "Mise à jour du cache du site..." -ForegroundColor Cyan
Write-Host "Version : $Version"
Write-Host ""

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Update-VersionInUrl {
    param([string]$Url)

    # Ne touche pas aux ressources externes, data:, ancres, mailto:, etc.
    if (
        $Url -match '^(https?:)?//' -or
        $Url -match '^(data:|mailto:|tel:|#)'
    ) {
        return $Url
    }

    # Ne versionne que les ressources statiques.
    if ($Url -notmatch '\.(css|js|png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf)(\?.*)?$') {
        return $Url
    }

    # Supprime l'ancien paramètre v= sans toucher aux autres paramètres éventuels.
    if ($Url -match '([?&])v=[^&''"]*') {
        $Url = [regex]::Replace($Url, '([?&])v=[^&''"]*', {
            param($m)
            if ($m.Groups[1].Value -eq '?') { return "?v=$Version" }
            return "&v=$Version"
        })
        return $Url
    }

    if ($Url.Contains('?')) {
        return "$Url&v=$Version"
    }

    return "$Url?v=$Version"
}

$HtmlCount = 0
$CssCount = 0

# 1. HTML : href="" et src=""
Get-ChildItem -Path $Root -Recurse -File -Filter "*.html" | ForEach-Object {
    $Path = $_.FullName
    $Text = [System.IO.File]::ReadAllText($Path)

    $NewText = [regex]::Replace(
        $Text,
        '(?<prefix>\b(?:href|src)\s*=\s*["''])(?<url>[^"'']+)(?<suffix>["''])',
        {
            param($m)
            $newUrl = Update-VersionInUrl $m.Groups['url'].Value
            return $m.Groups['prefix'].Value + $newUrl + $m.Groups['suffix'].Value
        },
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    if ($NewText -ne $Text) {
        [System.IO.File]::WriteAllText($Path, $NewText, $Utf8NoBom)
        $HtmlCount++
    }
}

# 2. CSS : url(...)
Get-ChildItem -Path $Root -Recurse -File -Filter "*.css" | ForEach-Object {
    $Path = $_.FullName
    $Text = [System.IO.File]::ReadAllText($Path)

    $NewText = [regex]::Replace(
        $Text,
        'url\(\s*(?<quote>["'']?)(?<url>[^)"'']+)\k<quote>\s*\)',
        {
            param($m)
            $url = $m.Groups['url'].Value.Trim()
            $newUrl = Update-VersionInUrl $url
            $quote = $m.Groups['quote'].Value
            return "url(" + $quote + $newUrl + $quote + ")"
        },
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    if ($NewText -ne $Text) {
        [System.IO.File]::WriteAllText($Path, $NewText, $Utf8NoBom)
        $CssCount++
    }
}

# Petit témoin de version en ligne.
$VersionFile = Join-Path $Root "version.txt"
[System.IO.File]::WriteAllText(
    $VersionFile,
    "Version du site : $Version`r`nMise à jour : $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')`r`n",
    $Utf8NoBom
)

Write-Host "Terminé." -ForegroundColor Green
Write-Host "$HtmlCount fichier(s) HTML mis à jour."
Write-Host "$CssCount fichier(s) CSS mis à jour."
Write-Host ""
Write-Host "Tu peux maintenant envoyer le site sur GitHub." -ForegroundColor Cyan
Write-Host ""
Read-Host "Appuie sur Entrée pour fermer"
