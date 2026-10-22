"""Filtrer réellement les contenus publiés, selon le calendrier de Paris."""
from datetime import date, datetime
from copy import deepcopy
from zoneinfo import ZoneInfo

PARIS = ZoneInfo('Europe/Paris')


def paris_day(instant=None):
    if instant is None:
        return datetime.now(PARIS).date()
    if isinstance(instant, str):
        if len(instant) == 10:
            return date.fromisoformat(instant)
        instant = datetime.fromisoformat(instant.replace('Z', '+00:00'))
    if isinstance(instant, datetime):
        if instant.tzinfo is None:
            raise ValueError('Une heure de simulation doit préciser son fuseau.')
        return instant.astimezone(PARIS).date()
    if isinstance(instant, date):
        return instant
    raise ValueError('Date invalide.')


def release_day(episode):
    value = episode.get('plannedDate') or episode.get('releaseDate')
    return date.fromisoformat(value) if value else date.min


def public_episode(episode, today, excerpts):
    """Aucun auteur, description, source, lien vidéo ou extrait avant la date."""
    available = release_day(episode) <= today
    public = {key: deepcopy(episode[key]) for key in ('number', 'id', 'title', 'plannedDate') if key in episode}
    public['available'] = available
    if not available:
        return public
    for key in ('author', 'question', 'description', 'videos', 'sources', 'announcedOnly'):
        if key in episode:
            public[key] = deepcopy(episode[key])
    public['excerpts'] = [deepcopy(excerpts[key]) for key in episode.get('excerptIds', [])
                          if key in excerpts and excerpts[key].get('approved') is True]
    return public
